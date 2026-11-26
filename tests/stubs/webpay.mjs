// Webpay falso: registra el monto, nunca llama a Transbank.
export async function initTransaction(amount, buyOrder, orderId, returnUrl) {
  globalThis.__webpay = { amount, buyOrder, orderId, returnUrl };
  return { url: "https://webpay.invalid/init", token: "fake-token" };
}
