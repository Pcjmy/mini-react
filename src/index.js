import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    }
  }
  throw Error('Unkonw action.');
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 22 });

  return <div>
    <button onClick={() => {
      dispatch({type: 'incremented_age'})
    }}>Increment age</button>
    <p>Hello! You are { state.age }</p>
  </div>
}

ReactDOM.render(<Counter/>, document.getElementById('root'));
