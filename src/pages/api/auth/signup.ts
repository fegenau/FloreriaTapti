import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    // Validar datos
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email y contraseña son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ message: 'La contraseña debe tener al menos 6 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ message: 'Email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Registrar usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/login`,
      },
    });

    if (error) {
      // Manejo de errores específicos
      let message = error.message;
      if (error.message.includes('already registered')) {
        message = 'Este email ya está registrado. Intenta iniciar sesión.';
      }
      return new Response(
        JSON.stringify({ message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data.user) {
      return new Response(
        JSON.stringify({ message: 'Error al crear la cuenta' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hashear la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar datos en la tabla profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          email: email.trim(),
          password: hashedPassword,
          created_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error('Error al crear perfil:', profileError);
      // Nota: El usuario se creó en auth pero falló en profiles
      // Considera si quieres eliminar el usuario de auth o registrar este error
      return new Response(
        JSON.stringify({ message: 'Error al crear el perfil de usuario' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Cuenta creada exitosamente. Se envió un email de confirmación. Por favor verifica tu email.',
        redirectTo: '/login',
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en signup:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
