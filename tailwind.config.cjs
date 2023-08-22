/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  important: true,
  corePlugins: {
    preflight: false,
  },
  content: ['./js/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1677ff',
      },
      screens: {
        sm: '576px', // iphone SE
        md: '810px', // ipad 直向
        lg: '1080px', // ipad 橫向
        xl: '1280px', // mac air
        xxl: '1440px',
      },
    },
  },
  plugins: [],
  safelist: [
    'relative',
    'pb-12',
    'cursor-pointer',
    'w-full',
    'aspect-square',
    'mt-2',
    'mb-0',
    'mt-1',
    'text-red-500',
    'absolute',
    'bottom-0',
    'grid',
    'grid-cols-2',
    'md:grid-cols-3',
    'xl:grid-cols-4',
    'gap-8',
  ],
}
