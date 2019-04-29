/**
 * @jest-environment jsdom
 */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { createGlobalStyle, css } from '../index';
import { expectCSSMatches, stripCWSArray, stripCWS } from './utils';
import flatten from '../utils/flatten';
import hashCode from '../utils/hashCode';
import isStatelessFunction from '../utils/isStatelessFunction';
import stringifyRules from '../utils/stringifyRules';

describe('css()', () => {
  test('Without interpolations, css() just returns array with css string as its only element', () => {
    const cssResult = stripCWSArray(css`
      .div {
        color: blue;
      }
    `);
    expect(cssResult).toEqual([`.div { color: blue; }`]);
  });

  test('Without arguments passed to css(), it just returns interleaved CSS strings and untouched functions', () => {
    const cssResult = stripCWSArray(css`
      body {
        color: ${props => (props.light ? 'white' : 'black')};
        font-family: ${props => props.theme.typography.fontFamily};
      }
    `);

    const expectation = stripCWSArray([
      `body {
      color: `,
      props => (props.light ? 'white' : 'black'),
      `;
      font-family: `,
      props => props.theme.typography.fontFamily,
      `;
    }`,
    ]);

    expect(cssResult).toEqual(expectation);
  });

  test('css() can convert plain JS objects to css strings', () => {
    expect(stripCWSArray(css({ html: { marginTop: '15px' } }))).toEqual(['html { margin-top: 15px; }']);
  });
});

describe('flatten', () => {
  test('flatten adds px units to objects that require it, when converting to css string', () => {
    expect(stripCWS(flatten({ html: { marginTop: 15 } }))).toEqual('html { margin-top: 15px; }');
  });

  test('Can convert empty object to empty css string', () => {
    expect(flatten({})).toEqual('');
  });

  test('Can use boolen as object value', () => {
    expect(stripCWS(flatten({ html: { marginTop: true } }))).toEqual('html { margin-top: ; }');
  });
});

describe('GlobalStyleComponent', () => {
  let reset;
  let globalStyle;
  let GlobalStyleComponent;
  let outputCss;

  beforeAll(() => {
    reset = css`
      .div {
        color: blue;
      }
    `;

    globalStyle = css`
      .my-class2 {
        margin-bottom: 10rem;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
      }
      html {
        background-color: blue;
      }
      body {
        color: ${props => (props.light ? 'white' : 'black')};
        font-family: ${props => props.theme.typography.fontFamily};
      }
    `;

    GlobalStyleComponent = createGlobalStyle`${reset}${globalStyle}`;
  });

  test('createGlobalStyle() can accept empty ruleset, and will then not inject anything in head.', () => {
    createGlobalStyle``;
    expectCSSMatches('');
  });

  test('GlobalStyleComponent inserts after another head style, if one exists', () => {
    const node = document.createElement('style');
    node.id = 'otherStyle';
    node.innerHTML = 'html { color: blue; }';
    const { head } = document;
    head.appendChild(node);

    const component = TestRenderer.create(
      <GlobalStyleComponent dark theme={{ typography: { fontFamily: 'Roboto' } }} />
    );

    const styleArray = document.querySelectorAll('style');
    expect(styleArray.length).toBe(2);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    styleArray.forEach(style => style.parentElement.removeChild(style));
  });

  test('GlobalStyleComponent injects correct CSS styles in head', () => {
    const component = TestRenderer.create(
      <GlobalStyleComponent light theme={{ typography: { fontFamily: 'Arial' } }} />
    );

    outputCss = `.div {
      color: blue;
    }
    .my-class2 {
      margin-bottom: 10rem;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
    html {
      background-color: blue;
    }
    body {
      color: white;
      font-family: Arial;
    }`;

    expectCSSMatches(outputCss);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('GlobalStyleComponent overrides old head style, if style already exists', () => {
    const component = TestRenderer.create(
      <GlobalStyleComponent dark theme={{ typography: { fontFamily: 'Roboto' } }} />
    );

    outputCss = `.div {
      color: blue;
    }
    .my-class2 {
      margin-bottom: 10rem;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
    html {
      background-color: blue;
    }
    body {
      color: black;
      font-family: Roboto;
    }`;

    expectCSSMatches(outputCss);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('GlobalStyleComponent with default theme', () => {
    const component = TestRenderer.create(<GlobalStyleComponent dark />);

    outputCss = `.div {
      color: blue;
    }
    .my-class2 {
      margin-bottom: 10rem;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
    html {
      background-color: blue;
    }
    body {
      color: black;
      font-family: Arial;
    }`;

    expectCSSMatches(outputCss);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('GlobalStyleComponent can return a React component, which first runs createStyles(props), but does not inject anything into head.', () => {
    const { ReactStyleComponent } = GlobalStyleComponent.globalStyle;
    const component = TestRenderer.create(
      <ReactStyleComponent light theme={{ typography: { fontFamily: 'Arial' } }} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('GlobalStyleComponent should give warning if run with children', () => {
    const component = TestRenderer.create(<GlobalStyleComponent>child</GlobalStyleComponent>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('other small functions', () => {
  test('hashCode if 0 length string', () => {
    expect(hashCode('')).toBe(0);
  });

  test('isStatelessFunction with normal function', () => {
    expect(isStatelessFunction(() => {})).toBe(true);
  });

  test('isStatelessFunction with React function', () => {
    // eslint-disable-next-line react/prefer-stateless-function
    class ReactComp extends React.Component {
      render() {
        return <h1>Hello</h1>;
      }
    }
    expect(isStatelessFunction(ReactComp)).toBe(false);
  });

  test('stringifyRules can be called with selector and prefix specified seperately.', () => {
    expect(() => stringifyRules(['div { color: red; }'], 'html', ':not')).not.toThrow();
  });
});
