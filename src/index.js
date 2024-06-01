import React from 'react';
import ReactDOM from 'react-dom';

class DerivedState extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      preveUserId: 'zhangsan',
      email: 'zhangsan@qq.com'
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userId !== state.preveUserId) {
      return {
        preveUserId: props.userId,
        email: (props.userId + '@qq.com')
      }
    }
  }

  render() {
    return <div>
      <h1>Email:</h1>
      <h2>{this.state.email}</h2>
    </div>
  }
}

class ParentClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = { id: 'zhangsan' }
  }

  changeUserId = () => {
    this.setState({
      id: 'lisi'
    })
  }

  render() {
    return <div>
      <input type="button" value="点击改变userId" onClick={() => this.changeUserId()} />
      <DerivedState userId={this.state.id} />
    </div>
  }
}

ReactDOM.render(<ParentClass />, document.getElementById('root'));
