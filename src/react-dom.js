import { REACT_ELEMENT } from './utils';

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
    if (typeof children[i] === 'string') {
      parent.appendChild(document.createTextNode(children[i]));
    } else {
      mount(children[i], parent);
    }
  }
}

function createDOM(VNode) {
  // 1.创建元素 2.处理子元素 3.处理属性值
  const { type, props } = VNode;
  let dom;
  if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT && type.IS_CLASS_COMPONENT) {
    return getDomByClassComponent(VNode);
  }
  if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT) {
    return getDomByFunctionComponent(VNode);
  }
  if (type && VNode.$$typeof === REACT_ELEMENT) {
    dom = document.createElement(type);
  }
  if (props) {
    if (typeof props.children === 'object' && props.children.type) {
      mount(props.children, dom)
    } else if (Array.isArray(props.children)) {
      mountArray(props.children, dom);
    } else if(typeof props.children === 'string') {
      dom.appendChild(document.createTextNode(props.children));
    }
  }
  setPropsForDOM(dom, props);
  VNode.dom = dom;
  return dom;
}

function getDomByClassComponent(VNode) {
  let { type, props } = VNode;
  let instance = new type(props);
  let renderVNode = instance.render();
  instance.oldVNode = renderVNode;
  // 测试代码
  setTimeout(() => {
    instance.setState({ a: '123456' });
    console.log('123456');
  }, 3000);
  // 测试代码
  if(!renderVNode) return null;
  return createDOM(renderVNode);
}

function getDomByFunctionComponent(VNode) {
  let { type, props } = VNode;
  let renderVNode = type(props);
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
      // TODO: 事件处理
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

export function updateDomTree(oldDOM, newVNode) {
  let parentNode = oldDOM.parentNode;
  parentNode.removeChild(oldDOM);
  parentNode.appendChild(createDOM(newVNode));
}

const ReactDOM = {
  render
}

export default ReactDOM;
