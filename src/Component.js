import { findDomByVNode, updateDomTree } from './react-dom';

export let updaterQueue = {
  isBatch: false,
  updaters: new Set(),
}
export function flushUpdaterQueue() {
  updaterQueue.isBatch = false;
  for(let updater of updaterQueue.updaters) {
    updater.launchUpdate();
  }
  updaterQueue.updaters.clear();
}
class Updater {
  constructor(ClassComponentInstance) {
    this.ClassComponentInstance = ClassComponentInstance;
    this.pendingStates = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState);
    this.preHandleForUpdate();
  }
  preHandleForUpdate() {
    if (updaterQueue.isBatch) {
      updaterQueue.updaters.add(this);
    } else {
      this.launchUpdate();
    }
  }
  launchUpdate() {
    const { ClassComponentInstance, pendingStates } = this;
    if (pendingStates.length === 0) return
    ClassComponentInstance.state = this.pendingStates.reduce((preState, newState) => {
      return { ...preState, ...newState }
    }, ClassComponentInstance.state);
    this.pendingStates.length = 0;
    ClassComponentInstance.update();
  }
}

export class Component {
  static IS_CLASS_COMPONENT = true;
  constructor(props) {
    this.state = {};
    this.props = props;
    this.updater = new Updater(this);
  }
  setState(partialState) {
    // 1.合并属性
    // 2.重新渲染进行更新
    this.updater.addState(partialState);
  }
  update() {
    // 1.获取重新执行render函数后的虚拟DOM 新虚拟DOM
    // 2.根据新虚拟DOM生成新的真实DOM
    // 3.将真实DOM挂载到页面上
    let oldVNode = this.oldVNode;
    let oldDOM = findDomByVNode(oldVNode);
    let newVNode = this.render();
    updateDomTree(oldDOM, newVNode);
    this.oldVNode = newVNode
  }
}
