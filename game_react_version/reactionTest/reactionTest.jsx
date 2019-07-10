import React, { useState, useRef } from 'react';
import ResetButton from './resetButton';

const ReactionTest = () => {
  const [state, setState] = useState('waiting');
  const [message, setMessage] = useState('클릭해서 시작!');
  const [result, setResult] = useState([]);
  /**
   * Ref는 DOM을 참조하는 기능 말고도 Hook에서 변수로 사용이 가능하다.
   * state와 달리 ref값은 변경되도 새로 랜더링되자 않는다.
   */
  const startTime = useRef(null);
  const endTime = useRef(null);
  const timeOut = useRef(null);

  const onClickScreen = () => {
    if (state === 'waiting') {
      setState('ready');
      setMessage('초록색이 되면 클릭하세요!');
      timeOut.current = setTimeout(() => {
        setState('now');
        setMessage('지금 클릭!!!');
        startTime.current = new Date();
      }, Math.floor(Math.random() * 1000) + 2000);
    } else if (state === 'ready') {
      clearTimeout(timeOut.current);
      setState('waiting');
      setMessage('너무 빨리 클릭했습니다.');
    } else if (state === 'now') {
      endTime.current = new Date();
      setState('waiting');
      setMessage('성공.. 클릭하면 재시작 :)');
      setResult(prev => {
        return [...prev, endTime.current - startTime.current];
      });
    }
  };

  const renderAverage = () => {
    return result.length === 0 ? null : (
      <div>평균 시간: {result.reduce((p, c) => p + c) / result.length}ms</div>
    );
  };

  const handleReset = () => {
    return setResult([]);
  };

  return (
    <>
      <div id="screen" className={state} onClick={onClickScreen}>
        {message}
      </div>
      {renderAverage()}
      <ResetButton onReset={handleReset} result={result} />
    </>
  );
};

export default ReactionTest;
