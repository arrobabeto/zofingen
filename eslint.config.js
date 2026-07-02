import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import vueParser from "vue-eslint-parser"
import pluginVue from "eslint-plugin-vue"

export default tseslint.config(
  // settings
  //////////////////////////////////////////////////////////////////////////////
  { ignores: [".nuxt/", "vite-env.d.ts"] },
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: "module",
      },
    },
  },

  // recommended rules
  //////////////////////////////////////////////////////////////////////////////
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],

  // basic rules
  //////////////////////////////////////////////////////////////////////////////
  {
    rules: {
      "no-undef": 0,
      "no-var": 2,
      "prefer-const": 2,
      "prefer-rest-params": 2,
      "prefer-spread": 2,
      yoda: 2,
      "no-shadow": 2,
      "no-invalid-this": 2,
      "no-extend-native": 2,
      "no-array-constructor": 2,
      "no-eval": 2,
      "no-implied-eval": 2,
    },
  },

  // typescript rules
  //////////////////////////////////////////////////////////////////////////////
  {
    rules: {
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-unused-vars": 0,
      "@typescript-eslint/no-non-null-assertion": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/array-type": [
        2,
        {
          default: "array",
          readonly: "array",
        },
      ],
      "@typescript-eslint/naming-convention": [
        2,
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
      ],
    },
  },

  // vue rules
  //////////////////////////////////////////////////////////////////////////////
  {
    rules: {
      "vue/multi-word-component-names": 0,
      "vue/component-api-style": [2, ["script-setup", "composition"]],
      "vue/require-prop-types": 2,
      "vue/define-props-declaration": [2, "type-based"],
      "vue/require-explicit-emits": 2,
      "vue/define-emits-declaration": [2, "type-based"],
      "vue/require-v-for-key": 2,
      "vue/valid-v-for": 2,
      "vue/v-for-delimiter-style": [2, "of"],
      "vue/no-v-html": 2,
      "vue/no-v-text": 2,
      "vue/no-multiple-template-root": 2,
      "vue/prefer-separate-static-class": 2,
      "vue/no-restricted-class": [2, "/!.*/", "/[A-Z]/"],
      "vue/block-order": [2, { order: ["script", "template"] }],
      "vue/block-lang": [2, { script: { lang: "ts" } }],
      "vue/enforce-style-attribute": [2, { allow: ["scoped"] }],
      "vue/no-restricted-static-attribute": [2, "class-name", "css-property"],
      "vue/no-restricted-component-names": [
        2,
        "Form",
        "Button",
        "Input",
        "Label",
        "Table",
      ],
      "vue/no-restricted-html-elements": [
        2,
        {
          element: "img",
          message: "use <NuxtImg /> instead",
        },
      ],
      "vue/no-restricted-props": [
        2,
        {
          name: "className",
          message: "use class, no need to define a custom prop",
        },
        {
          name: "cssProperty",
          message: "use class, no need to define a custom prop",
        },
      ],
    },
  },

  // syntax rules
  //////////////////////////////////////////////////////////////////////////////
  {
    rules: {
      "no-restricted-syntax": [
        2,
        {
          selector: "CallExpression[callee.name='require']",
          message: "use import",
        },
        {
          selector: "ImportDeclaration[source.value=/^\\.\\./]",
          message: "use import aliases instead of relative paths",
        },
        {
          selector: "CallExpression[callee.name=/^(useState|provide|inject)$/]",
          message: "use reactive objects for shared state",
        },
        {
          selector:
            "Program > VariableDeclaration > VariableDeclarator > :matches(FunctionExpression, ArrowFunctionExpression)",
          message: "use function declaration style in root scope",
        },
        {
          selector:
            "CallExpression[callee.name='defineProps'] > TSTypeParameterInstantiation > TSTypeLiteral > TSPropertySignature > TSTypeAnnotation TSFunctionType",
          message: "use defineEmits and events instead of callback props",
        },
        {
          selector:
            "VariableDeclarator[id.name='tailwind'] Property[key.name='colors'] Property[key.name=/[A-Z]/]",
          message:
            "use kebab-case color names with shared prefixes (red-400, red-500 red-600, ...)",
        },
        {
          selector:
            "VariableDeclarator[id.name='tailwind'] Property[key.name='screens'] Property",
          message: "use the default breakpoints",
        },
      ],
    },
  },

  // import rules
  //////////////////////////////////////////////////////////////////////////////
  {
    files: ["**/*.ts"],
    rules: {
      "no-restricted-imports": [
        2,
        {
          paths: [
            {
              name: "vue",
              importNames: ["ref"],
              message: "do not use ref outside vue components",
            },
          ],
        },
      ],
    },
  },

  // ...
  //////////////////////////////////////////////////////////////////////////////
)
