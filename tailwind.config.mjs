
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
  theme: {
    extend: {
      colors: {
        tapti: {
          gold: '#C8A037',
          deep: '#0D0720',
          lilac: '#BFA5E3',
          purple: '#6F4AA1',
          ivory: '#F7F4EE'
        }
      },
      fontFamily: {
        serif: ['"Times New Roman"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
