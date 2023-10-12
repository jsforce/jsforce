# Getting started

Clone the project and `cd` into it:
```
git@github.com:jsforce/jsforce.git
cd jsforce
```

then install dependencies and build:
```
npm install
npm run build
```

`npm run build` will generate all the distributions for node and browsers:
* Node CJS build
* Browser ESM build
* Browser bundles

# Type-checking

Babel doesn't perform type-checking when transpiling TS to JS, run `npm run typecheck` to validate the code and tests with the TypeScript compiler. 

# Lint
Run `npm run lint` 

# Tests

TODO: add example using `npx zx scripts/org-setup.mjs` to create a scratch org for testing.

TODO: explain how to run browser tests (why we need proxy, how it works, etc)
