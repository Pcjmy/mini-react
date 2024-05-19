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
