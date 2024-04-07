import React from './react';
import ReactDOM from './react-dom';
function MyFunctionComponent(props) {
  return <div style={{ color: 'red'}}>Hello React</div>;
}

class MyClassComponent extends React.Component {
  render() {
    return <div style={{ color: 'red'}}>Hello React<span>{this.props.name}</span></div>;
  }
}

ReactDOM.render(<MyClassComponent name="child 1"/>, document.getElementById('root'));
console.log(<MyClassComponent name="child 1" />);
