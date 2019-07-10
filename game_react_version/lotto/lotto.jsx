import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { getWinNumbers } from './util';
import Ball from './Ball';

const lotto = () => {
  /**
   * - Hooks 에서는 랜더링 될 때마다 전체를 다시 호출하기 때문에
   *   속도 문제가 발생할 수 있다.
   * * useMemo : 함수 리턴 값을 저장해서 재 호출을 막는다.
   * * useCallback : 함수를 저장한다.
   * * useMemo, useCallback, useEffect는 두번째 인자인
   * * 배열안의 값에 따라서 새로 호출된다. 없으면 처음에만 호출된다.
   */
  const lottoNumbers = useMemo(() => getWinNumbers(), []);
  const [winNumbers, setWinNumbers] = useState(lottoNumbers);
  const [winBalls, setWinBalls] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef([]);

  /**
   * !! componentDidUpdate만 사용하고 싶을 때 패턴
   */
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      // 처음 컴포넌트가 마운트 될 때 아무 작업도 실행되지 않는다.
      mounted.current = true;
    } else {
      // ajax 같은 작업들을 처음 이후 랜더링될 때마다 실행
    }
    return () => {};
  }, []); // 두 번째 인자인 배열 안에 값을 넣어주고 그 값이 변할 때 실행된다.

  /**
   * 두 번째 인자인 배열의 값이 변할 때 마다 실행된다. (componentDidUpdate)
   * 빈 배열일 경우는 처음에만 실행 (componentDidMount)
   * return 값은 componentWillUnmount
   * ! timeouts.current의 배열 안에 값이 추가될 때는 실행되지 않는다.
   * ! 배열이 새로 교체될 때만(메모리가 새로 할당) 실행 된다.
   */
  useEffect(() => {
    getWinBalls();
    return () => {
      timeouts.current.forEach(v => clearTimeout(v));
    };
  }, [timeouts.current]);

  /**
   * 로또 번호를 설정하는 함수
   */
  const getWinBalls = () => {
    // 로또 번호
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = setTimeout(() => {
        setWinBalls(prevBalls => [...prevBalls, winNumbers[i]]);
      }, (i + 1) * 1000);
    }

    // 보너스 번호
    timeouts.current[6] = setTimeout(() => {
      setBonus(winNumbers[winNumbers.length - 1]);
      setRedo(true);
    }, 7000);
  };

  /**
   * 로또 재시작 함수
   * - 함수 자체를 기억해 놓아서 계속되는 호출을 막는다.
   * - 배열안의 변수가 변할 때 마다 함수를 새로 기억한다.
   * - 자식 컴포넌트에게 함수를 props로 넘길 때
   * - useCallback을 사용한다. (자식 컴포넌트에서 혼돈을 피하기 위해서)
   */
  const onClickRedo = useCallback(() => {
    console.log(winNumbers);
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  }, [winNumbers]);

  return (
    <>
      <div>당첨 숫자</div>
      <div id="result">
        {winBalls.map(v => (
          <Ball key={v} number={v} />
        ))}
      </div>
      <div>보너스 번호</div>
      {bonus && <Ball number={bonus} />}
      {redo ? <button onClick={onClickRedo}>재시작</button> : null}
    </>
  );
};

export default lotto;
