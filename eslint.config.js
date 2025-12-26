import antfu from '@antfu/eslint-config'

export default antfu({
    astro: true,
    ignores: ['**/*.{ts,js,tsx,jsx,json}'],
})
