import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT } from './utils';
import { addEvent } from './event';

function render(VNode, containDOM) {
  // 将虚拟DOM转化成真实DOM
  // 将得到的真实DOM挂载到containDOM中
  mount(VNode, containDOM);
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
    children[i].index = i;
    mount(children[i], parent);
  }
}

function createDOM(VNode) {
  // 1.创建元素 2.处理子元素 3.处理属性值
  const { type, props, ref } = VNode;
  let dom;
  if (type && type.$$typeof === REACT_FORWARD_REF) {
    return getDomByForwardRefFunction(VNode);
  }
  if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT && type.IS_CLASS_COMPONENT) {
    return getDomByClassComponent(VNode);
  }
  if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT) {
    return getDomByFunctionComponent(VNode);
  }
  if (typeof type === REACT_TEXT) {
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
  if(!renderVNode) return null;
  return createDOM(renderVNode);
}

function getDomByFunctionComponent(VNode) {
  let { type, props } = VNode;
  let renderVNode = type(props);
  if (!renderVNode) return null;
  return createDOM(renderVNode);
}

function getDomByForwardRefFunction(VNode) {
  const { type, props, ref } = VNode;
  const renderVNode = type.render(props, ref);
  if (!renderVNode) return null;
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
  let parentNode = oldDOM.parentNode;
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
      break;
    case 'DELETE':
      break;
    case 'REPLACE':
      break;
    default:
      break;
  }
}

const ReactDOM = {
  render
}

export default ReactDOM;
