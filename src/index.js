import React from 'react';
import ReactDOM from 'react-dom';
// function MyFunctionComponent(props) {
//   return <div style={{ color: 'red'}}>Hello React</div>;
// }

const result = React.forwardRef((props, ref) => {
  return <div ref={ref}></div>
})
console.log(result);

// class MyClassComponent extends React.Component {
//   counter = 1;
  
//   constructor(props) {
//     super(props)
//     this.state = { count: '0' }
//   }

//   updateShowText(newText) {
//     this.setState({
//       count: newText + ''
//     })
//   }

//   render() {
//     return <div style={
//       {
//         color: 'red',
//         cursor: 'pointer',
//         border: '1px solid gray',
//         borderRadius: '6px',
//         display: 'inline-block',
//         padding: '6px 12px'
//       }
//     } onClick = {() => this.updateShowText(++this.counter)}>count: {this.state.count}</div>;
//   }
// }

// ReactDOM.render(<MyClassComponent name="child 1"/>, document.getElementById('root'));
// console.log(<MyClassComponent name="child 1" />);
