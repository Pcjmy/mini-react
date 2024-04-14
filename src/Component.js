export let updaterQueue = {
  isBatch: false,
  updaters: new Set(),
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
    // if (isBatch) {

    // } else {
    //   this.launchUpdate();
    // }
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
  }
  setState(partialState) {
    // 1.合并属性
    // 2.重新渲染进行更新
    this.update()
  }
  update() {
    // 1.获取重新执行render函数后的虚拟DOM 新虚拟DOM
    // 2.根据新虚拟DOM生成新的真实DOM
    // 3.将真实DOM挂载到页面上
  }
}
