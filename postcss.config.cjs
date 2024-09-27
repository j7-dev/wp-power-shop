// eslint-disable-next-line no-undef
module.exports = {
	plugins: [
		require('postcss-import'),
		require('tailwindcss/nesting')(require('postcss-nesting')),
		require('tailwindcss'),
		require('autoprefixer'),
	]
}
