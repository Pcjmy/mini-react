import React from './react';
import ReactDOM from './react-dom';
function MyFunctionComponent(props) {
  return <div style={{ color: 'red'}}>Hello React</div>;
}

class MyClassComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { a: '123' }
  }
  render() {
    return <div style={{ color: 'red'}}>Hello React<span>{this.state.a}</span></div>;
  }
}

ReactDOM.render(<MyClassComponent name="child 1"/>, document.getElementById('root'));
console.log(<MyClassComponent name="child 1" />);
