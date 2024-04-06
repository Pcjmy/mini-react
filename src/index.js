import React from './react';
import ReactDOM from './react-dom';
function MyFunctionComponent(props) {
  return <div style={{ color: 'red'}}>Hello React</div>;
}
ReactDOM.render(<MyFunctionComponent />, document.getElementById('root'));
console.log(<div style={{ color: 'red'}}>Hello React</div>);
