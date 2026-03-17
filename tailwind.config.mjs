
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Paleta Blue Steel Premium
				brand: {
					50:  "#eef5fb",
					100: "#dbe9f6",
					200: "#b7d3ec",
					300: "#93bde2",
					400: "#7FAED6",  // Celeste premium
					500: "#5f8fb8",
					600: "#4a7194",
					700: "#355470",
					800: "#22374c",
					900: "#0B1220"   // Background principal
				},
				steel: {
					50:  "#f1f5f9",
					100: "#e2e8f0",
					200: "#cbd5e1",
					300: "#94a3b8",
					400: "#64748b",
					500: "#475569",
					600: "#334155",
					700: "#1f2937",  // Secciones
					800: "#111827",  // Navbar
					900: "#020617"
				},
				// Mapeo de colores legacy para compatibilidad con clases existentes
				'midnight-violet': {
					50:  "#eef5fb",
					100: "#dbe9f6",
					200: "#b7d3ec",
					300: "#93bde2",
					400: "#7FAED6",
					500: "#5f8fb8",
					600: "#4a7194",
					700: "#334155",
					800: "#1f2937",
					900: "#111827",
					950: "#0B1220"
				},
				'honey-bronze': {
					50:  "#f1f5f9",
					100: "#e2e8f0",
					200: "#C7DFF2",  // Celeste hielo
					300: "#93bde2",
					400: "#7FAED6",  // Celeste premium
					500: "#5f8fb8",
					600: "#4a7194",
					700: "#2F5D8C",  // Azul acero
					800: "#22374c",
					900: "#0B1220",
					950: "#060a13"
				},
				'cherry-blossom': {
					50:  "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#9ca3af",  // Texto secundario
					500: "#6b7280",
					600: "#4b5563",
					700: "#374151",
					800: "#1f2937",
					900: "#111827",
					950: "#030712"
				},
				'carbon-black': {
					50:  "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					500: "#64748b",
					600: "#475569",
					700: "#334155",
					800: "#1e293b",
					900: "#0f172a",
					950: "#020617"
				},
				'dusty-olive': {
					50:  "#f1f5f9",
					100: "#e2e8f0",
					200: "#cbd5e1",
					300: "#94a3b8",
					400: "#64748b",
					500: "#475569",
					600: "#334155",
					700: "#1f2937",
					800: "#111827",
					900: "#020617",
					950: "#010309"
				},
				// Alias de compatibilidad
				'tapti': {
					'deep':  '#0B1220',  // Azul midnight
					'ivory': '#F8FAFC',  // Blanco suave
					'gold':  '#7FAED6'   // Celeste premium (acento)
				}
			}
		},
	},
	plugins: [],
}
