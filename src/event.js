export function addEvent(dom, eventName, bindFunction) {
  dom.attach = dom.attach || {};
  dom.attach[eventName] = bindFunction;
  // 事件合成机制的核心点一：事件绑定到document
  if (document[eventName]) return ;
  document[eventName] = dispatchEvent;
}
