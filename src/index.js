import React from './react';
import ReactDOM from './react-dom';
// import './index.css';
// React18写法
// const root = ReactDOM.createRoot(document.getElementById('root'));
// const element = <div>Hello React</div>;
// root.render(element);

// 旧版本初始化
// ReactDOM.render(<div>Hello React</div>, document.getElementById('root'));
ReactDOM.render(<div style={{ color: 'red'}}>Hello React</div>, document.getElementById('root'));
console.log(<div style={{ color: 'red'}}>Hello React</div>);
