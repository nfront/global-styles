import isFunction from './isFunction';
import isStatelessFunction from './isStatelessFunction';
import isPlainObject from './isPlainObject';
import hyphenate from './hyphenateStyleName';
import addUnitIfNeeded from './addUnitIfNeeded';

/**
 * It's falsish not falsy because 0 is allowed.
 */
const isFalsish = chunk => {
  return chunk === undefined || chunk === null || chunk === false || chunk === '';
};

const objToCss = (obj, prevKey) => {
  const css = Object.keys(obj)
    .filter(key => !isFalsish(obj[key]))
    .map(key =>
      isPlainObject(obj[key]) ? objToCss(obj[key], key) : `${hyphenate(key)}: ${addUnitIfNeeded(key, obj[key])};`
    )
    .join(' ');
  return prevKey
    ? `${prevKey} {
  ${css}
}`
    : css;
};

export default function flatten(chunk, executionContext) {
  if (Array.isArray(chunk)) {
    const ruleSet = [];

    for (let i = 0, len = chunk.length, result; i < len; i += 1) {
      result = flatten(chunk[i], executionContext);

      if (result != null) {
        if (Array.isArray(result)) ruleSet.push(...result);
        else ruleSet.push(result);
      }
    }

    return ruleSet;
  }

  if (isFalsish(chunk)) {
    return null;
  }

  /* Either execute or defer the function */
  if (isFunction(chunk)) {
    if (isStatelessFunction(chunk) && executionContext) {
      const result = chunk(executionContext);

      return flatten(result, executionContext);
    }
    return chunk;
  }

  /* Handle objects */
  return isPlainObject(chunk) ? objToCss(chunk) : chunk.toString();
}
