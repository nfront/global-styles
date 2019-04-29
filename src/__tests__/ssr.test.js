/**
 * @jest-environment node
 */
import { createGlobalStyle, css } from '../index';

test('check if document exists here', () => {
  expect(global.document).toBe(undefined);
});

describe('GlobalStyleComponent', () => {
  let reset;
  let globalStyle;
  let GlobalStyleComponent;

  beforeAll(() => {
    reset = css`
      .div {
        color: blue;
      }
    `;

    globalStyle = css`
      .my-class2 {
        margin-bottom: 10rem;
      }
      html {
        background-color: blue;
      }
      body {
        color: ${props => (props.light ? 'white' : 'black')};
        font-family: ${props => props.theme.typography.fontFamily};
      }
    `;

    GlobalStyleComponent = createGlobalStyle`
      ${reset}
      ${globalStyle}
    `;
  });

  test('GlobalStyleComponent will not inject anything if run server side', () => {
    const { injectStyleInBrowser } = GlobalStyleComponent.globalStyle;
    expect(injectStyleInBrowser).not.toThrow();
  });
});
