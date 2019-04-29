/**
 * This sets up the end-to-end test suite.
 */

function isFunction(test) {
  return typeof test === 'function';
}

export const stripComments = str => str.replace(/\/\*.*?\*\/\n?/g, '');

export const stripWhitespace = str =>
  str
    .trim()
    .replace(/([;\{\}])/g, '$1  ')
    .replace(/\s+/g, ' ')
    .replace(/^\s+|\s+$/gm, '');

export const stripCWS = str => (isFunction(str) ? str.toString() : stripWhitespace(stripComments(str)));

export const stripCWSArray = arr => arr.map(stripCWS);

export const getCSS = scope =>
  Array.from(scope.querySelectorAll('style'))
    .map(tag => tag.innerHTML)
    .join('\n')
    .replace(/ {/g, '{')
    .replace(/:\s+/g, ':')
    .replace(/:\s+;/g, ':;');

export const expectCSSMatches = (_expectation, opts = { ignoreWhitespace: true }) => {
  // NOTE: This should normalise both CSS strings to make irrelevant mismatches less likely
  const expectation = _expectation
    .replace(/ {/g, '{')
    .replace(/:\s+/g, ':')
    .replace(/:\s+;/g, ':;');

  const css = getCSS(document);

  if (opts.ignoreWhitespace) {
    const stripped = stripWhitespace(stripComments(css));
    expect(stripped).toEqual(stripWhitespace(expectation));
    return stripped;
  }
  expect(css).toEqual(expectation);
  return css;
};
