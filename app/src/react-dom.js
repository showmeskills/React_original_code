import {
  REACT_TEXT,
  REACT_COMPONENT,
  REACT_FORWARD_REF,
  REACT_FRAGMENT,
  MOVE,
  PLACEMENT
} from "./constants";
import {
  addEvent
} from './event';
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
  let {
    type,
    props,
    ref
  } = vdom;
  //根据不同的虚拟DOM的类型创建真实的DOM
  let dom;
  if (type && type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else if (type === REACT_FRAGMENT) {
    dom = document.createDocumentFragment();
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
  let {
    type,
    props,
    ref
  } = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
  let {
    type: ClassComponent,
    props,
    ref
  } = vdom;
  //创建类组件的实例
  let classInstance = new ClassComponent(props);
  vdom.classInstance = classInstance;
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
  let {
    type: FunctionComponent,
    props
  } = vdom;
  let renderVdom = FunctionComponent(props);
  //把函数组件渲染的虚拟DOM放在了函数组件自己的虚拟DOM上
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    childrenVdom.mountIndex = i;
    render(childrenVdom[i], parentDOM);
  }
}
/**
 * 根据虚拟DOM获取真实DOM
 * @param {*} vdom 虚拟DOM
 */
export function findDOM(vdom) {
  if (!vdom) return null;
  if (vdom.dom) { // vdom.dom 原生组件的情况
    return vdom.dom;
  } else {
    if (vdom.classInstance) { // 说明是类组件
      vdom = vdom.classInstance.oldRenderVdom;
    } else { // 说明是函数组件
      vdom = vdom.oldRenderVdom;
    }

    return findDOM(vdom);
  }
}
export function compareTwoVdom(oldDOM, parentDOM, oldVdom, newVdom, nextDOM) {
  if (!oldVdom && !newVdom) { // 新老节点都没有
    return;
  } else if (oldVdom && !newVdom) { //老的有新的没有
    unMountVdom(oldVdom);
  } else if (!oldVdom && newVdom) {
    let newDOM = createDOM(newVdom);
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM); //bug
    }
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) { //新老节点都有,类型不一样
    unMountVdom(oldVdom);
    let newDOM = createDOM(newVdom);
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM); //bug
    }
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
  } else { //新老节点都有,类型一样
    updateElement(parentDOM, oldVdom, newVdom);
  }
}

/**
 * 新老节点深度对比
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateElement(parentDOM, oldVdom, newVdom) {
  if (oldVdom.type === REACT_TEXT) {
    let currentDOM = newVdom.dom = findDOM(oldVdom);
    if (oldVdom.props !== newVdom.props) {
      currentDOM.textContent = newVdom.props;
    }
  } else if (typeof oldVdom.type === 'string') {
    let currentDOM = newVdom.dom = findDOM(oldVdom);
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (oldVdom.type === REACT_FRAGMENT) {
    //updateFragment(oldVdom, newVdom);
    updateChildren(parentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === 'function') {
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}


/**
 * 更新类组件
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateClassComponent(oldVdom, newVdom) {
  const classInstance = newVdom.classInstance = oldVdom.classInstance;
  //newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
  if (classInstance.UNSAFE_componentWillReceiveProps) {
    classInstance.UNSAFE_componentWillReceiveProps();
  }
  classInstance.updater.emitUpdate(newVdom.props)
}
/**
 * 更新函数组件
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateFunctionComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom);
  if (!currentDOM) return;
  let {
    type,
    props
  } = newVdom;
  let newRenderVdom = type(props);
  compareTwoVdom(currentDOM, currentDOM.parentNode, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}
/**
 * 更新节点
 * @param {*} parentDOM 父真实dom
 * @param {*} oldVchildren 老儿子虚拟dom数组
 * @param {*} newVchildren 新儿子虚拟dom数组
 */
function updateChildren(parentDOM, oldVchildren, newVchildren) {
  oldVchildren = Array.isArray(oldVchildren) ? oldVchildren : [oldVchildren];
  newVchildren = Array.isArray(newVchildren) ? newVchildren : [newVchildren];
  // const maxLength = Math.max(oldVchildren.length,newVchildren.length);
  // for(let i = 0; i < maxLength; i++){
  //   let nextVdom = oldVchildren.find((item,index)=>index>i&&item && findDOM(item));
  //   compareTwoVdom(findDOM(oldVchildren[i]), parentDOM,oldVchildren[i],newVchildren[i],findDOM(nextVdom));
  // }
  //优化更新
  //1.构建map
  const keyedOldMap = {};
  let lastPlacedIndex = 0;
  oldVchildren.forEach((oldVChild, index) => {
    let oldKey = oldVChild.key ? oldVChild.key : index;
    keyedOldMap[oldKey] = oldVChild;
  });
  //创建一个DOM补丁包，收集DOM操作
  const patch = [];
  newVchildren.forEach((newVChild, index) => {
    newVChild.mountIndex = index;
    const newKey = newVChild.key ? newVChild.key : index;
    let oldVChild = keyedOldMap[newKey];
    if (oldVChild) {
      updateElement(findDOM(oldVChild).parentNode,oldVChild, newVChild);
      if (oldVChild.mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVChild,
          newVChild,
          mountIndex: index,
        })
      }
      // 如果一个老节点被复用了 就可以map中删除
      delete keyedOldMap[newKey];
      lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex); // 把当前节点赋值给上个节点，如果大的话

    } else {
      patch.push({
        type: PLACEMENT,
        newVChild,
        mountIndex: index
      })
    }
  })
  //过滤出需要移动的老节点
  let moveVChildren = patch.filter(action => action.type === MOVE).map(action => action.oldVChild);
  Object.values(keyedOldMap).concat(moveVChildren).forEach(oldVChild => {
    let currentDOM = findDOM(oldVChild);
    currentDOM.remove();
  });
  patch.forEach(action => {
    let {
      type,
      oldVChild,
      newVChild,
      mountIndex
    } = action;
    let childNodes = parentDOM.childNodes; //老的真实DOM节点的数组
    if (type === PLACEMENT) { //插入
      let newDOM = createDOM(newVChild);
      let childNode = childNodes[mountIndex];
      if (childNode) {
        parentDOM.insertBefore(newDOM, childNode);
      } else {
        parentDOM.appendChild(newDOM);
      }
    } else if (type === MOVE) {
      let oldDOM = findDOM(oldVChild);
      let childNode = childNodes[mountIndex];
      if (childNode) {
        parentDOM.insertBefore(oldDOM, childNode);
      } else {
        parentDOM.appendChild(oldDOM);
      }
    }
  })
}

/**
 * 删除或者卸载老节点
 * @param {*} vdom 
 */
function unMountVdom(vdom) {
  let {
    props,
    ref,
    classInstance
  } = vdom;
  let currentDOM = findDOM(vdom);
  if (classInstance && classInstance.UNSAFE_componentWillMount) {
    classInstance.UNSAFE_componentWillMount();
  }
  if (ref) ref.current = null;

  if (props.children) {
    let children = Array.isArray(props.children) ? props.children : [props.children];
    children.forEach(unMountVdom)
  }

  if (currentDOM) currentDOM.remove();
}
/**
 * 把新的属性同步到真实DOM上
 * @param {*} dom 
 * @param {*} oldProps 
 * @param {*} newProps 
 */
function updateProps(dom, oldProps = {}, newProps = {}) {
  //处理新增和修改属性
  for (const key in newProps) { // style={} className id
    if (key === 'children') {
      continue; //儿子属性会单独处理，并不会在此处理
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