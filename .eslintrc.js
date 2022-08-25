module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['airbnb-base', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'consistent-return': 0,
        'no-use-before-define': 0,
        'no-restricted-syntax': 0
    }
};
