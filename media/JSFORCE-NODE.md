# `jsforce-node`

## What is the `@jsforce/jsforce-node` package?

It's a "lite" version of `jsforce` that doesn't include the browser builds and CLI deps, making it ~30M smaller than the `jsforce` package which includes all node and browser builds.
You can use it as a drop-in replacement of `jsforce` in your Node.js project to reduce bundle size.

For reference, the `jsforce` package contains:
1. CJS & ESM builds for node
2. ESM browser builds
3. browser bundles + minified builds
4. TS source code (src folder)
5. CLI dependencies like `commander` and `inquirer`

## Where does it live?

This same repo!

Since `jsforce-node` only removes builds and deps, we just modify the `package.json` at release time to remove some folders/deps from the final package.

## How does it work?
We run `npm run jsforce-node` at publish time to make the following changes to the `package.json`:

1. Change `name` field to `@jsforce/jsforce-node`
2. Remove browser/CLI-related folders from `files` field.
3. Remove `bin` field
4. Remove browser/CLI dependencies

Each `jsforce` release will be followed by a `@jsforce/jsforce-node` release, both having the same package version (e.g. `jsforce@3.5.1` -> `@jsforce/jsforce-node@3.5.1`).
