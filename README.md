ESLint react specific rule
==========================

Rule requires multiline for jsx component if it's singleline version is too long

# Installation

Install [ESLint](https://www.github.com/eslint/eslint)

```sh
$ npm install eslint
```

You should install [react plugin](https://github.com/yannickcr/eslint-plugin-react)

```sh
$ npm install eslint-plugin-react
```

Then you can install jsx-max-len plugin

```sh
$ npm install eslint-plugin-jsx-max-len
```

Add to your config .eslintrc.js file
```
"plugins": [ "jsx-max-len" ]
"rules": {      
    "jsx-max-len/jsx-max-len": [2, { "lineMaxLength": 100, "tabWidth": 2, "maxAttributesPerLine": 1 }]
}
```

# Usage

For single-line components, which overflow maximum line length, "Consider multi-line" message will be shown. For example:
```
// consider multi-line for next component (maximum line length: 80)
<ExampleComponent attributeOne="one" attributeTwo="two" attributeThree="three" attributeFour="four"/>
```

For multi-line components rule checks for maximum attributes per line. For example:
```
// Next component produce error (maximum attributes per line: 1)
<ExampleComponent attributeOne="one"
attributeTwo="two"
attributeThree="three" attributeFour="four"/>

// Next component pass rule (maximum attributes per line: 1)
<ExampleComponent
  attributeOne="one"
  attributeTwo="two"
  attributeThree="three"
  attributeFour="four"/>
```
