import React from 'react';
import ReactDOM from 'react-dom';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  // 1.组建挂载到页面上之后调用
  // 2.需要依赖真实DOM节点的相关初始化动作需要放在这里
  // 3.适合加载数据
  // 4.适合事件订阅
  // 5.不适合在这里调用setState
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    console.log('componentDidMount');
  }

  // 1.更新完成后调用，初始化渲染不会调用
  // 2.当组件完成更新，需要对DOM进行某种操作的时候，适合在这个函数中进行
  // 3.当当前的props和之前的props有所不同的时候，可以在这里进行有必要的网络请求
  // 4.这里虽然可以调用setState，但是要记住是有条件的调用，否则会陷入死循环
  // 5.如何shouldComponentUpdate返回false，componentDidUpdate不会执行
  // 6.如果实现了getSnapshotBeforeUpdate，那么componentDidUpdate会接收到第三个参数
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate', this.state.date);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, World!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Clock />);
