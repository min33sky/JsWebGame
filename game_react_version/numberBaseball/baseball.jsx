import React, { useState, useRef } from 'react';
import Tries from './Tries';
const { getNumbers } = require('./lib');

const Baseball = () => {
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState(getNumbers());
  const [tries, setTries] = useState([]);
  const [result, setResult] = useState('');
  const [inputWarn, setInputWarn] = useState('');
  const inputRef = useRef(null);

  const handleChange = e => {
    let input = e.target.value;
    setValue(input);
    if (input.length > 4) {
      setInputWarn('4자리 이상입니다...👺');
    } else if ([1, 2, 3].includes(input.length)) {
      setInputWarn('4자리를 입력해주세요.😊');
    } else if (input.length === 4) {
      setInputWarn('');
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setResult('');
    if (value.length !== 4) return;

    if (value === answer.join('')) {
      setTries(prevState => {
        return [...prevState, { try: value, result: '홈런....' }];
      });
      setValue('');
      setAnswer(getNumbers());
      setTries([]);
      setResult('홈런😍😍😍');
    } else {
      let inputValue = value.split('').map(e => parseInt(e));
      let strike = 0;
      let ball = 0;
      if (tries.length >= 9) {
        // 횟수초과. 정답 알려주고 리겜
        setResult(`실패...😂 정답: ${answer}`);
        setValue('');
        setTries([]);
        setAnswer(getNumbers());
      } else {
        // 동일한 숫자가 존재하면 ball, 자리까지 일치하면 strike
        for (let index = 0; index < answer.length; index++) {
          if (answer[index] === inputValue[index]) {
            strike++;
          } else if (answer.includes(inputValue[index])) {
            ball++;
          }
        }
        setValue('');
        setTries(prevState => {
          return [
            ...prevState,
            { try: inputValue, result: `${strike}스트라이크 ${ball}볼` },
          ];
        });
      }
    }
    inputRef.current.focus();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="label">입력 : </label>
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={handleChange}
        />
        <button>클릭</button>
        <span style={{ color: 'red' }}>{inputWarn}</span>
      </form>
      <Tries tries={tries} />
      <div>시도 : {tries.length}</div>
      <div style={{ color: 'blue' }}>{result}</div>
    </>
  );
};

export default Baseball;
