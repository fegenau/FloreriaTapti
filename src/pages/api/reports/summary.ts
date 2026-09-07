import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdmin } from '../../../lib/auth';

const PAID_STATUSES = ['paid', 'shipped'];
// Estados que se consideran "vendido" para el conteo de ramos por defecto.
const SOLD_STATUSES = ['paid', 'shipped'];

interface OrderItem {
  id?: string;
  name?: string;
  size?: string;
  quantity?: number;
  price?: number;
  [key: string]: unknown;
}

interface OrderRow {
  id: string;
  customer_name: string;
  customer_email?: string;
  status: string;
  total_amount: number;
  shipping_commune?: string;
  created_at: string;
  items?: OrderItem[] | null;
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    if (!(await verifyAdmin(cookies))) {
      return new Response(
        JSON.stringify({ message: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fromParam = url.searchParams.get('from');
    const toParam = url.searchParams.get('to');
    const daysParam = parseInt(url.searchParams.get('days') ?? '30', 10);
    const days = Number.isFinite(daysParam) && daysParam > 0 ? Math.min(daysParam, 365) : 30;

    // statusFilter: 'all' | 'sold' (pagado+enviado) | un estado puntual
    const statusFilter = url.searchParams.get('status') || 'sold';

    let since: Date;
    let until: Date;

    if (fromParam) {
      since = new Date(`${fromParam}T00:00:00`);
    } else {
      since = new Date();
      since.setHours(0, 0, 0, 0);
      since.setDate(since.getDate() - (days - 1));
    }

    if (toParam) {
      until = new Date(`${toParam}T23:59:59.999`);
    } else {
      until = new Date();
    }

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_name, customer_email, status, total_amount, shipping_commune, created_at, items')
      .gte('created_at', since.toISOString())
      .lte('created_at', until.toISOString())
      .order('created_at', { ascending: false })
      .limit(5000);

    if (ordersError) {
      return new Response(
        JSON.stringify({ message: 'Error al obtener pedidos', error: ordersError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: subscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('id, is_active, duration_days, created_at')
      .gte('created_at', since.toISOString())
      .lte('created_at', until.toISOString());

    if (subsError) {
      return new Response(
        JSON.stringify({ message: 'Error al obtener suscripciones', error: subsError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const allOrders = (orders ?? []) as OrderRow[];
    const allSubscriptions = subscriptions ?? [];

    // Distribución por estado y KPIs de ingresos: siempre sobre el rango completo de fechas,
    // sin aplicar el filtro de estado (para poder comparar contra el total).
    const ordersByStatus: Record<string, number> = {};
    for (const o of allOrders) {
      const status = o.status || 'sin_estado';
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    }

    const confirmedOrders = allOrders.filter((o) => PAID_STATUSES.includes(o.status));
    const confirmedRevenue = confirmedOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

    const dailyRevenueMap = new Map<string, number>();
    const cursor = new Date(since);
    cursor.setHours(0, 0, 0, 0);
    const untilDay = new Date(until);
    untilDay.setHours(0, 0, 0, 0);
    while (cursor.getTime() <= untilDay.getTime()) {
      dailyRevenueMap.set(dateKey(cursor), 0);
      cursor.setDate(cursor.getDate() + 1);
    }
    for (const o of confirmedOrders) {
      const key = dateKey(new Date(o.created_at));
      if (dailyRevenueMap.has(key)) {
        dailyRevenueMap.set(key, (dailyRevenueMap.get(key) || 0) + (Number(o.total_amount) || 0));
      }
    }
    const dailyRevenue = Array.from(dailyRevenueMap.entries()).map(([date, total]) => ({ date, total }));

    // Filtro de estado aplicado sobre el set de pedidos que se usa para tabla, comunas y conteo de ramos.
    const filteredOrders = statusFilter === 'all'
      ? allOrders
      : statusFilter === 'sold'
        ? allOrders.filter((o) => SOLD_STATUSES.includes(o.status))
        : allOrders.filter((o) => o.status === statusFilter);

    const filteredTotalValue = filteredOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

    const topCommunes = Object.entries(
      filteredOrders.reduce((acc: Record<string, number>, o) => {
        const commune = o.shipping_commune?.trim();
        if (commune) acc[commune] = (acc[commune] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([commune, count]) => ({ commune, count }));

    // Conteo de ramos/tamaños vendidos a partir de la columna "items" (sin incluir imágenes).
    const productSalesMap = new Map<string, { name: string; size: string; quantity: number; revenue: number }>();
    for (const o of filteredOrders) {
      const items = Array.isArray(o.items) ? o.items : [];
      for (const item of items) {
        const name = (item.name || 'Producto sin nombre').toString();
        const size = (item.size || 'Único').toString();
        const key = `${name}__${size}`;
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const current = productSalesMap.get(key) || { name, size, quantity: 0, revenue: 0 };
        current.quantity += quantity;
        current.revenue += quantity * price;
        productSalesMap.set(key, current);
      }
    }
    const productSales = Array.from(productSalesMap.values()).sort((a, b) => b.quantity - a.quantity);

    // Listado completo (sin imágenes) para la tabla de ventas totales y las exportaciones.
    const ordersForExport = filteredOrders.map((o) => ({
      id: o.id,
      customer_name: o.customer_name,
      customer_email: o.customer_email,
      status: o.status,
      total_amount: o.total_amount,
      shipping_commune: o.shipping_commune,
      created_at: o.created_at,
      items: (Array.isArray(o.items) ? o.items : []).map((item) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    return new Response(
      JSON.stringify({
        data: {
          filters: {
            from: dateKey(since),
            to: dateKey(until),
            status: statusFilter,
          },
          totalOrders: filteredOrders.length,
          filteredTotalValue,
          confirmedRevenue,
          averageOrderValue: confirmedOrders.length ? Math.round(confirmedRevenue / confirmedOrders.length) : 0,
          activeSubscriptions: allSubscriptions.filter((s) => s.is_active).length,
          totalSubscriptions: allSubscriptions.length,
          ordersByStatus,
          dailyRevenue,
          topCommunes,
          productSales,
          orders: ordersForExport,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en GET reports/summary:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
