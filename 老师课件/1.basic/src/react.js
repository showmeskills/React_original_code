import { REACT_ELEMENT, REACT_FORWARD_REF } from './constants';
import { toVdom } from './utils';
import { Component } from './Component'
/**
 * 创建一个元素，也就是所谓的虚拟DOM
 * @param {*} type 
 * @param {*} config 
 * @param {*} children 
 */
function createElement(type, config, children) {
  let ref;
  let key;

  if (config) {
    ref = config.ref;//通过它可以获取此真实DOM元素
    key = config.key;//后面会用于DOMDIFF移动元素的处理
    delete config.__source;
    delete config.__self;
    delete config.ref;
    delete config.key;
  }
  let props = {
    ...config
  };
  /* if (children.length === 1) {
    props.children = toVdom(children[0]);
  } else if (children.length > 1) {
    props.children = children.map(toVdom)
  } */
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(toVdom);
  } else if (arguments.length === 3) {
    props.children = toVdom(children);
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    props,
    ref,
    key
  }
}
function createRef() {
  return { current: null };
}
function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render
  }
}
const React = {
  createElement,
  Component,
  createRef,
  forwardRef
}
export default React;