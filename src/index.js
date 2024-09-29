import React, { useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';

const MemoFunctionComponent = React.memo(function Child({data, handleClick}) {
  console.log('Child Component');
  return <button onClick={handleClick}>Age: {data.age}</button>;
});

function App() {
  console.log('App Component');
  const [name, setName] = useState('zhangsan');
  const [age, setAge] = useState(18);
  let data = useMemo(() => ({age}), [age]);
  let handleClick = useCallback(() => {
    setAge(age + 1)
  }, [age]);

  return <div>
    <input value={name} onInput={e => setName(e.target.value)} />
    <MemoFunctionComponent data={data} handleClick={handleClick} />
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'));
