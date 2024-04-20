import { updaterQueue, flushUpdateQueue } from './Component';

export function addEvent(dom, eventName, bindFunction) {
  dom.attach = dom.attach || {};
  dom.attach[eventName] = bindFunction;
  // 事件合成机制的核心点一：事件绑定到document
  if (document[eventName]) return ;
  document[eventName] = dispatchEvent;
}

function dispatchEvent(nativeEvent) {
  updaterQueue.isBatch = true;
  // 事件合成机制的核心点二：屏蔽浏览器之间的差异
  let syntheticEvent = createSyntheticEvent(nativeEvent);
  flushUpdateQueue();
}

function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  return syntheticEvent;
}
