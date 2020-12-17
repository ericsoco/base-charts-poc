# Base Charts

A simple JavaScript API to build [Base Charts](https://www.figma.com/file/7OHADDKRhsvxIV6PUyYh4A/%E2%9D%96-Base-charts) design-compliant charts. The API aligns with [Base Web](https://baseweb.design/) paradigms to provide a familiar interface for Base Web users.

Base Charts is essentially a translation layer, offering a unified API that delegates chart rendering to arbitrary third-party libraries. The initial implementation wraps [Nivo](https://nivo.rocks/).

## Demo

[Base Charts](https://ericsoco.github.io/base-charts-poc/)

## Local development

```
yarn
yarn start
```

## Deploying

```
yarn deploy
```

## Publishing to npm

```
yarn publish
```

## Environment variables

The `base-charts-demo` package supplies environment variables to Webpack and the runtime via `dotenv` files: `.env` (for production) and `env.development` (for development).

`ASSET_PATH`: Set as Webpack `publicPath`, and `react-router` `basename`. - For prod, must match the path from the domain root, e.g. `/base-charts-poc/` for hosting the base-charts-poc repo on GitHub Pages. - For dev, should be `'/'` to serve up files at localhost root for `webpack-dev-server`.
