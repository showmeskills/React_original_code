import { REACT_TEXT, REACT_COMPONENT, REACT_FORWARD_REF } from "./constants";
import { addEvent } from './event';
/**
 * 把虚拟DOM变成真实DOM
 * 并且插入到父节点容器中
 * @param {*} vdom 
 * @param {*} container 
 */
function render(vdom, container) {
  //把虚拟DOM变成真实DOM
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
  if (newDOM.componentDidMount) {
    newDOM.componentDidMount();
  }
}

function createDOM(vdom) {
  let { type, props, ref } = vdom;
  //根据不同的虚拟DOM的类型创建真实的DOM
  let dom;
  if (type && type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else if (typeof type === 'function') {
    if (type.isReactComponent === REACT_COMPONENT) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }
  if (props) {
    updateProps(dom, {}, props);
    if (props.children && typeof props.children === 'object' && props.children.$$typeof) {
      render(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  //当我们根据虚拟DOM创建好真实DOM之后,vdom.dom = dom
  vdom.dom = dom;
  if (ref) ref.current = dom;
  return dom;
}
function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  //创建类组件的实例
  let classInstance = new ClassComponent(props);
  //组件将要挂载 
  if (classInstance.UNSAFE_componentWillMount) {
    classInstance.UNSAFE_componentWillMount();
  }
  if (ref) ref.current = classInstance;
  let renderVdom = classInstance.render();
  //把类组件渲染的虚拟DOM放到类的实例上
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
  let dom = createDOM(renderVdom);
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}
function mountFunctionComponent(vdom) {
  let { type: FunctionComponent, props } = vdom;
  let renderVdom = FunctionComponent(props);
  //把函数组件渲染的虚拟DOM放在了函数组件自己的虚拟DOM上
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    render(childrenVdom[i], parentDOM);
  }
}
/**
 * 根据虚拟DOM获取真实DOM
 * @param {*} vdom 虚拟DOM
 */
export function findDOM(vdom) {
  if (!vdom) return null;
  if (vdom.dom) {
    return vdom.dom;
  } else {
    let renderVdom = vdom.oldRenderVdom;
    return findDOM(renderVdom);
  }
}
export function compareTwoVdom(oldDOM, parentDOM, oldVdom, newVdom) {
  let newDOM = createDOM(newVdom);
  parentDOM.replaceChild(newDOM, oldDOM);
}
/**
 * 把新的属性同步到真实DOM上
 * @param {*} dom 
 * @param {*} oldProps 
 * @param {*} newProps 
 */
function updateProps(dom, oldProps = {}, newProps = {}) {
  //处理新增和修改属性
  for (const key in newProps) {// style={} className id
    if (key === 'children') {
      continue;//儿子属性会单独处理，并不会在此处理
    } else if (key === 'style') {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (/^on[A-Z].*/.test(key)) {
      //dom[key.toLowerCase()] = newProps[key];
      addEvent(dom, key.toLowerCase(), newProps[key]);
    } else {
      //id className
      dom[key] = newProps[key]
    }
  }
  //处理删除属性
  for (const key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      delete dom[key];
    }
  }
}
const ReactDOM = {
  render
}
export default ReactDOM;