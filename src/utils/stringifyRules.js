const COMMENT_REGEX = /^\s*\/\/.*$/gm;

export default function stringifyRules(rules, selector, prefix) {
  const flatCSS = rules.join('').replace(COMMENT_REGEX, ''); // replace JS comments

  const cssStr = selector && prefix ? `${prefix} ${selector} { ${flatCSS} }` : flatCSS;

  return cssStr;
}
