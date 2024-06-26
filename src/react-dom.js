import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT, REACT_MEMO, MOVE, CREATE, shallowCompare } from './utils';
import { addEvent } from './event';
import { resetHookIndex } from './hooks';

export let emitUpdateForHooks;

function render(VNode, containDOM) {
  // 将虚拟DOM转化成真实DOM
  // 将得到的真实DOM挂载到containDOM中
  mount(VNode, containDOM);
  emitUpdateForHooks = () => {
    resetHookIndex();
    updateDomTree(VNode, VNode, findDomByVNode(VNode));
  }
}

function mount(VNode, containDOM) {
  let newDOM = createDOM(VNode);
  newDOM && containDOM.appendChild(newDOM);
}

function mountArray(children, parent) {
  if (!Array.isArray(children)) {
    return ;
  }
  for (let i = 0; i < children.length; i++) {
    if (!children[i]) {
      children.splice(i, 1);
      continue;
    }
    children[i].index = i;
    mount(children[i], parent);
  }
}

function createDOM(VNode) {
  // 1.创建元素 2.处理子元素 3.处理属性值
  const { type, props, ref } = VNode;
  let dom;
  if (type && type.$$typeof === REACT_MEMO) {
    return getDomByMemoFunctionComponent(VNode);
  }

  if (type && type.$$typeof === REACT_FORWARD_REF) {
    return getDomByForwardRefFunction(VNode);
  }

  if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT && type.IS_CLASS_COMPONENT) {
    return getDomByClassComponent(VNode);
  }

  if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT) {
    return getDomByFunctionComponent(VNode);
  }

  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.text);
  } else if (type && VNode.$$typeof === REACT_ELEMENT) {
    dom = document.createElement(type);
  }
  if (props) {
    if (typeof props.children === 'object' && props.children.type) {
      mount(props.children, dom)
    } else if (Array.isArray(props.children)) {
      mountArray(props.children, dom);
    }
  }
  setPropsForDOM(dom, props);
  VNode.dom = dom;
  ref && (ref.current = dom);
  return dom;
}

function getDomByClassComponent(VNode) {
  let { type, props, ref } = VNode;
  let instance = new type(props);
  ref && (ref.current = instance);
  let renderVNode = instance.render();
  instance.oldVNode = renderVNode;
  VNode.classInstance = instance;
  if(!renderVNode) return null;
  let dom = createDOM(renderVNode);
  if (instance.componentDidMount) {
    instance.componentDidMount();
  }
  return dom;
}

function getDomByFunctionComponent(VNode) {
  let { type, props } = VNode;
  let renderVNode = type(props);
  if (!renderVNode) return null;
  VNode.oldRenderVNode = renderVNode;
  let dom = VNode.dom = createDOM(renderVNode);
  return dom;
}

function getDomByForwardRefFunction(VNode) {
  const { type, props, ref } = VNode;
  const renderVNode = type.render(props, ref);
  if (!renderVNode) return null;
  return createDOM(renderVNode);
}

function getDomByMemoFunctionComponent(VNode) {
  let {type, props} = VNode;
  let renderVNode = type.type(props);
  if (!renderVNode) return null;
  VNode.oldRenderVNode = renderVNode;
  return createDOM(renderVNode);
}

function setPropsForDOM(dom, VNodeProps = {}) {
  if (!dom) {
    return ;
  }
  for(let key in VNodeProps) {
    if (key === 'children') continue;
    if(/^on[A-Z].*/.test(key)) {
      addEvent(dom, key.toLowerCase(), VNodeProps[key]);
    } else if(key === 'style') {
      Object.keys(VNodeProps[key]).forEach(styleName => {
        dom.style[styleName] = VNodeProps[key][styleName];
      })
    } else {
      dom[key] = VNodeProps[key];
    }
  }
}

export function findDomByVNode(VNode) {
  if (!VNode) return ;
  if (VNode.dom) return VNode.dom;
}

export function updateDomTree(oldVNode, newVNode, oldDOM) {
  // 新节点、旧节点都不存在
  // 新节点存在，旧节点不存在
  // 新节点不存在，旧节点存在
  // 新节点存在，旧节点也存在，但是类型不一样
  // 新节点存在，旧节点也存在，类型也一样 ---> 值得我们进行深入的比较，探索复用相关节点的方案
  const typeMap = {
    NO_OPERATE: !oldVNode && !newVNode,
    ADD: !oldVNode && newVNode,
    DELETE: oldVNode && !newVNode,
    REPLACE: oldVNode && newVNode && oldVNode.type !== newVNode.type,
  }
  let UPDATE_TYPE = Object.keys(typeMap).filter(key => typeMap[key])[0];
  switch (UPDATE_TYPE) {
    case 'NO_OPERATE':
      break;
    case 'ADD':
      oldDOM.parentNode.appendChild(createDOM(newVNode));
      break;
    case 'DELETE':
      removeVNode(oldVNode);
      break;
    case 'REPLACE':
      removeVNode(oldVNode);
      oldDOM.parentNode.appendChild(createDOM(newVNode));
      break;
    default:
      // 深度的dom diff，新老虚拟DOM都存在且类型相同
      deepDOMDiff(oldVNode, newVNode);
      break;
  }
}

function removeVNode(oldVNode) {
  const currentDOM = findDomByVNode(oldVNode);
  if (currentDOM) {
    currentDOM.removeVNode();
  }
  if (oldVNode.classInstance && oldVNode.classInstance.compontWillUnmount) {
    oldVNode.classInstance.componentWillUnmount();
  }
}

function deepDOMDiff(oldVNode, newVNode) {
  let diffTypeMap = {
    ORIGIN_NODE: typeof oldVNode.type === 'string',
    CLASS_COMPONENT: typeof oldVNode.type === 'function' && oldVNode.type.IS_CLASS_COMPONENT,
    FUNCTION_COMPONENT: typeof oldVNode.type === 'function',
    TEXT: oldVNode.type === REACT_TEXT,
    MEMO: oldVNode.type.$$typeof === REACT_MEMO
  }
  let DIFF_TYPE = Object.keys(diffTypeMap).filter(key => diffTypeMap[key])[0];
  switch(DIFF_TYPE) {
    case 'ORIGIN_NODE':
      let currentDOM = newVNode.dom = findDomByVNode(oldVNode);
      setPropsForDOM(currentDOM, newVNode.props);
      updateChildren(currentDOM, oldVNode.props.children, newVNode.props.children);
      break;
    case 'CLASS_COMPONENT':
      updateClassComponent(oldVNode, newVNode);
      break;
    case 'FUNCTION_COMPONENT':
      updateFunctionComponent(oldVNode, newVNode);
      break;
    case 'TEXT':
      newVNode.dom = findDomByVNode(oldVNode);
      newVNode.dom.textContent = newVNode.props.text;
      break;
    case 'MEMO':
      updateMemoFunctionComponent(oldVNode, newVNode);
      break;
    default:
      break;
  }
}

function updateClassComponent(oldVNode, newVNode) {
  const classInstance = newVNode.classInstance = oldVNode.classInstance;
  classInstance.updater.launchUpdate(newVNode.props);
}

function updateFunctionComponent(oldVNode, newVNode) {
  let oldDOM = newVNode.dom = findDomByVNode(oldVNode);
  if (!oldDOM) return ;
  const { type, props } = newVNode;
  let newRenderVNode = type(props);
  updateDomTree(oldVNode.oldRenderVNode, newRenderVNode, oldDOM);
  newVNode.oldRenderVNode = newRenderVNode;
}

function updateMemoFunctionComponent(oldVNode, newVNode) {
  let { type } = oldVNode;
  if ((!type.compare && !shallowCompare(oldVNode.props, newVNode.props)) || (type.compare && !type.compare(oldVNode.props, newVNode.props))) {
    const oldDOM = findDomByVNode(oldVNode);
    const { type } = newVNode;
    let renderVNode = type.type(newVNode.props);
    updateDomTree(oldVNode.oldRenderVNode, renderVNode, oldDOM);
    newVNode.oldRenderVNode = renderVNode;
  } else {
    newVNode.oldRenderVNode = oldVNode.oldRenderVNode;
  }
}

// DOM DIFF算法的核心
function updateChildren(parentDOM, oldVNodeChildren, newVNodeChildren) {
  oldVNodeChildren = (Array.isArray(oldVNodeChildren) ? oldVNodeChildren : [oldVNodeChildren]).filter(Boolean);
  newVNodeChildren = (Array.isArray(newVNodeChildren) ? newVNodeChildren : [newVNodeChildren]).filter(Boolean);

  let lastNotChangedIndex = -1;
  let oldKeyChildMap = {};
  oldVNodeChildren.forEach((oldVNode, index) => {
    let oldKey = oldVNode && oldVNode.key ? oldVNode.key : index;
    oldKeyChildMap[oldKey] = oldVNode;
  })
  let actions = [];
  newVNodeChildren.forEach((newVNode, index) => {
    newVNode.index = index;
    let newKey = newVNode.key ? newVNode.key : index;
    let oldVNode = oldKeyChildMap[newKey];
    if (oldVNode) {
      deepDOMDiff(oldVNode, newVNode);
      if (oldVNode.index < lastNotChangedIndex) {
        actions.push({
          type: MOVE,
          oldVNode,
          newVNode,
          index
        })
      }
      delete oldKeyChildMap[newKey];
      lastNotChangedIndex = Math.max(lastNotChangedIndex, oldVNode.index);
    } else {
      actions.push({
        type: CREATE,
        newVNode,
        index
      })
    }
  })
  let VNodeToMove = actions.filter(action => action.type === MOVE).map(action => action.oldVNode);
  let VNodeToDelete = Object.values(oldKeyChildMap);
  VNodeToMove.concat(VNodeToDelete).forEach(oldVNode => {
    let currentDOM = findDomByVNode(oldVNode);
    currentDOM.remove();
  })

  actions.forEach(action => {
    let { type, oldVNode, newVNode, index } = action;
    let childNodes = parentDOM.childNodes;
    let childNode = childNodes[index];
    const getDomForInsert = () => {
      if (type === CREATE) {
        return createDOM(newVNode);
      }
      if (type === MOVE) {
        return findDomByVNode(oldVNode);
      }
    }
    if (childNode) {
      parentDOM.insertBefore(getDomForInsert(), childNode);
    } else {
      parentDOM.appendChild(getDomForInsert());
    }
  })
}

const ReactDOM = {
  render
}

export default ReactDOM;
