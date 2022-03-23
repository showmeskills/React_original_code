import { REACT_TEXT, REACT_ELEMENT } from './constants';
export function toVdom(element) {
  return typeof element === 'string' || typeof element === 'number' ? {
    $$typeof: REACT_ELEMENT, type: REACT_TEXT, props: element
  } : element
}