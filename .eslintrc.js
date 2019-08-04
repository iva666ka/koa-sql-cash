module.exports = {
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module",
        "ecmaFeatures": {}
    },
    "env": {
        "node": true,
        "es6": true,
        "jest": true,
    },
    "rules": {
        "object-shorthand": "off",
        "no-await-in-loop": "error",
        "linebreak-style": "off",
        'no-trailing-spaces': ['warn', {
            skipBlankLines: false,
            ignoreComments: false,
        }],
        'max-len': ['warn', {code: 120}]
    }
};