/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
	// important: '.tailwind',  // you have to use tailwindcss inside a .tailwind class container, or just type true.
	corePlugins: {
		preflight: false,
	},
	content: [
		'./js/src/**/*.{js,ts,jsx,tsx}',
		'./inc/**/*.php',
		'./inc/assets/src/**/*.ts',
	],
	theme: {
		extend: {
			animation: {
				// why need this? because elementor plugin might conflict with same animate keyframe name
				// we override the animation name with this
				pulse: 'tw-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			screens: {
				sm: '576px', // iphone SE
				md: '810px', // ipad Portrait
				lg: '1080px', // ipad Landscape
				xl: '1280px', // mac air
				xxl: '1440px',
			},
			keyframes: {
				'tw-pulse': {
					'50%': { opacity: '0.5' },
				},
			},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			const newUtilities = {
				'.right-to-left': {
					direction: 'rtl',
				},

				// classes conflicted with WordPress
				'.tw-hidden': {
					display: 'none',
				},
				'.tw-columns-1': {
					columnCount: 1,
				},
				'.tw-columns-2': {
					columnCount: 2,
				},
				'.tw-fixed': {
					position: 'fixed',
				},
				'.tw-block': {
					display: 'block',
				},
				'.tw-inline': {
					display: 'inline',
				},
			}
			addUtilities(newUtilities, ['responsive', 'hover'])
		},
	],
	safelist: [],
	blocklist: [
		// classes conflicted with WordPress
		'hidden',
		'columns-1',
		'columns-2',
		'fixed',
		'block',
		'inline',
		'rtl'
	],
}
