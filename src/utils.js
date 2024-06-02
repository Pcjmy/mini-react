export const REACT_ELEMENT = Symbol('react.element');
export const REACT_FORWARD_REF = Symbol('react.forward_ref');
export const REACT_TEXT = Symbol('react.text')
export const MOVE = Symbol('dom.diff.move')
export const CREATE = Symbol('dom.diff.create')
export const toVNode = (node) => {
  return typeof node === 'string' || typeof node === 'number' ? {
    type: REACT_TEXT,
    props: { text: node }
  } : node
}
export const deepClone = (data) => {
  let type = getType(data);
  let resultValue;
  if (type !== 'array' && type !=='object') return data;
  if (type === 'array') {
    resultValue = [];
    data.forEach(item => {
      resultValue.push(deepClone(item));
    })
    return resultValue;
  }
  if (type === 'object') {
    resultValue = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        resultValue[key] = deepClone(data[key]);
      }
    }
    return resultValue;
  }
}

export function getType(obj) {
  let typeMap = {
    '[Object Boolean]': 'boolean',
    '[Object Number]': 'number',
    '[Object String]': 'string',
    '[Object Function]': 'function',
    '[Object Array]': 'array',
    '[Object Date]': 'date',
    '[Object RegExp]': 'regExp',
    '[Object Undefined]': 'undefined',
    '[Object Null]': 'null',
    '[Object Object]': 'object',
  }
  return typeMap[Object.prototype.toString.call(obj)];
}
