[![Build Status](https://travis-ci.org/nfront/global-styles.svg?branch=master)](https://travis-ci.org/nfront/global-styles) [![Greenkeeper badge](https://badges.greenkeeper.io/nfront/global-styles.svg)](https://greenkeeper.io/) [![Maintainability](https://api.codeclimate.com/v1/badges/9b92debd461a76f384d6/maintainability)](https://codeclimate.com/github/nfront/global-styles/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/9b92debd461a76f384d6/test_coverage)](https://codeclimate.com/github/nfront/global-styles/test_coverage) [![npm bundle size](https://badgen.net/bundlephobia/min/@nfront/global-styles)](https://bundlephobia.com/result?p=@nfront/global-styles) [![npm (scoped)](https://img.shields.io/npm/v/@nfront/global-styles.svg)](https://www.npmjs.com/package/@nfront/global-styles)

[![Twitter URL](https://img.shields.io/twitter/url/https/github.com/nfront/global-styles.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20this%20npm%20package:&url=https%3A%2F%2Fgithub.com%2Fnfront%2Fglobal-styles) [![Twitter Follow](https://img.shields.io/twitter/follow/magnusriga.svg?label=Follow&style=social)](https://twitter.com/intent/follow?screen_name=magnusriga)

# @nfront/global-styles

A package for creating independent global CSS styles, and automatically placing them at the top of the `<head>` element.

This package was originally created to be used together with [gatsby-plugin-global-styles](https://github.com/nfront/gatsby-plugin-global-styles).

## Install

`npm install --save @nfront/global-styles`

or:

`yarn add @nfront/global-styles`

## Why to use

`global-styles` automatically combines your own global style sheets into one collective global `style` tag, and makes sure the global `style` tag ends up where you want it to be in the `<head>` element.

By default, the global `style` tag is placed at the top of `<head>`.

This package is particularly useful when utilizing several CSS styling systems.

For example, you might be using both `styled-components` and `Material-UI`. If you want to add your own **global** styling to this mix, it is important that the order of the `style` tags in the website's or app's `<head>` element is correct (properties in lower `style` tags overwrite the same properties in `style` tags above it).

As mentioned, this package allows you to create several independent style sheets and will automatically compose those together and add them as part of one `style` tag at the top of `<head>`. Global style sheets could for instance include your own personal global style sheet and a style sheet such as `normalize`.

Lastly, it is also possible to pass in props, like a theme, to your global style sheet. See below for instructions.

## How to use

In `src/utils/GlobalStyleComponent`:

```javascript
import { createGlobalStyle } from '@nfront/global-styles';
import reset from '../styles/reset';
import globalStyle from '../styles/globalStyle';

const GlobalStyleComponent = createGlobalStyle`
  ${reset}
  ${globalStyle}
`;

export default GlobalStyleComponent;
```

Here, `reset` and `globalStyle` are two JavaScript files that each contain their own global styles that we want to compile into one global style element.

As an example, in `src/styles/globalStyle`:

```javascript
import { css } from '@nfront/global-styles';

const globalStyles = css`
  .my-class2 {
    margin-bottom: 10rem;
  }

  html {
    background-color: blue;
  }
`;

export default globalStyles;
```

Finally, at the root level of your app / during your app's boot sequence:

```javascript
import GlobalStyleComponent from './src/styles/GlobalStyleComponent';

// Compiles the style element and injects it in head
GlobalStyleComponent.globalStyle.renderStyles();
```

Or, if using React, at the root level of your React code:

```javascript
import GlobalStyleComponent from './src/styles/GlobalStyleComponent';

// Compiles the style element and injects it in head
<GlobalStyleComponent />
```

## How to use props (like theme) in a global style file

To use `props`, like a theme, in a global style sheet, pass in the `props`.

A theme can be any module exporting a normal object. Its propertis are then accessible inside any global style sheet.

Here is a full example:

In `./src/styles/theme`:

```javascript
const theme = {
  fontFamily: [`"Roboto", "Helvetica", "Arial", "sans-serif"`].join(','),
  primaryColor: blue;
}

export default theme;
```

Or a `MUI theme` in './src/styles/theme':

```javascript
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';

const muiTheme = createMuiTheme({
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  palette: {
    primary: blue,
    secondary: orange,
    error: red,
    type: 'light',
    text: {
      primary: 'rgba(0, 0, 0, 0.8)',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: [`"Roboto", "Helvetica", "Arial", "sans-serif"`].join(','),
    h1: {
      fontSize: '2.25rem',
      fontFamily: [`"Roboto-Slab", "Roboto", "Helvetica", "Arial", sans-serif"`].join(','),
      color: 'rgba(0, 0, 0, 0.8)',
      lineHeight: 1.1,
      letterSpacing: 'normal',
    },
  },
});

export default muiTheme;
```

In `src/styles/globalStyle`:

```javascript
import { css } from 'global-styles';

const globalStyles = css`
  body {
    color: ${props => (props.light ? 'white' : 'black')};
    font-family: ${props => props.theme.typography.fontFamily};
  }
`;

export default globalStyles;
```

At the root level of your app / during your app's boot sequence:

```javascript
import GlobalStyleComponent from './src/styles/GlobalStyleComponent';
import theme from './src/styles/theme';

const GlobalStyle = GlobalStyleComponent.globalStyle;
const props = {
  light: true,
  theme: theme,
};

// Compiles the style element and injects it in head
GlobalStyle.renderStyles(props);
```

Or, if using React, at the root level of your React code:

```javascript
import GlobalStyleComponent from './src/styles/GlobalStyleComponent';
import theme from './src/styles/theme';

<GlobalStyleComponent theme={theme} light />
```

## Syntax highlighting

It is easy to add syntax highlighting. See the [styled-components docs](https://www.styled-components.com/docs/tooling#syntax-highlighting) for extensions that enable this in various IDEs.

For `Visual Studio Code`, the [Babel JavaScript](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel) plugin is one option that works well.