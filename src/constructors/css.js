import interleave from '../utils/interleave';
import isPlainObject from '../utils/isPlainObject';
import { EMPTY_ARRAY } from '../utils/empties';
import isFunction from '../utils/isFunction';
import flatten from '../utils/flatten';

export default function css(styles, ...interpolations) {
  if (isFunction(styles) || isPlainObject(styles)) {
    return flatten(interleave(EMPTY_ARRAY, [styles, ...interpolations]));
  }

  return flatten(interleave(styles, interpolations));
}
