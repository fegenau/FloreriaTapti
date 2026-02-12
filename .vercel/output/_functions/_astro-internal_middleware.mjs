import { d as defineMiddleware, s as sequence } from './chunks/index_BwcR4kwO.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_JH6cQa6h.mjs';
import 'piccolore';
import './chunks/astro/server_JR3jxAAG.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const response = await next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
