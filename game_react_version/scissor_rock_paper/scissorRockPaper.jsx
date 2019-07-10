import React, { useState, useRef, useEffect } from 'react';

/**
 * 가위 바위 보의 좌표
 * - 틀은 움직이지 않고 사진만 움직여서
 * - 원하는 그림을 보여준다.
 */
const rspCoords = {
  rock: '0',
  scissor: '-142px',
  paper: '-284px',
};

const scores = {
  scissor: 1,
  rock: 0,
  paper: -1,
};

const ScissorRockPaper = () => {
  const [imgCoord, setImgCoord] = useState(rspCoords.rock);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(false);
  const [cnt, setCnt] = useState(3);
  const [round, setRound] = useState(0);
  const interval = useRef(null);
  const counter = useRef(null);

  useEffect(() => {
    // componentDidMount, componentDidUpdate 역할
    interval.current = setInterval(changeHand, 100);
    return () => {
      // componentWillUnmount 역할
      clearInterval(interval.current);
    };
  }, [imgCoord]); // []안에 값이 바뀌면 useEffect를 다시 호출한다. (CDU)

  useEffect(() => {
    if (cnt === 0) {
      clearInterval(counter.current);
    }
    return () => {};
  }, [cnt]);

  /**
   * 사용자 버튼 클릭 메서드
   * : 함수를 리턴하는 함수
   * : onClick 이벤트의 콜백을 깔끔하게 처리하기 위해서
   */
  const onClickBtn = choice => () => {
    if (progress) return; // 현재 진행 중이면 실행 중지

    clearInterval(interval.current);
    const user = scores[choice];
    const cpu = scores[selectCPU(imgCoord)];
    setProgress(true); // 중복 실행을 막기 위해 진행 중 설정
    /**
     * user == cpu : 비김
     * user - cpu == 1, -2 : 패배
     * 그 외 : 승리
     */
    if (user === cpu) {
      setResult('Draw 😒');
    } else if ([1, -2].includes(user - cpu)) {
      setResult('You Lose.. 🤢');
      setScore(prev => prev - 1);
    } else {
      setResult('You Win!! 😍');
      setScore(prev => prev + 1);
    }
    setRound(prevRound => prevRound + 1);
    handleTimer();
  };

  /**
   * 재시작 타임을 알려주는 타이머
   */
  const handleTimer = () => {
    if (cnt === 0) setCnt(3);
    counter.current = setInterval(() => {
      setCnt(prev => prev - 1);
    }, 1000);

    // 3초뒤 게임 재시작
    setTimeout(() => {
      interval.current = setInterval(changeHand, 100);
      setProgress(false);
    }, 3000);
  };

  /**
   * CPU가 고른 가위바위보
   * * Object.entries() : 객체를 key & value의 2차원 배열로 리턴하는 함수
   */
  const selectCPU = imgCoord => {
    // cpu가 선택한 것을 알기 위해선 현재 정지된 좌표를 이용하면 된다.
    return Object.entries(rspCoords).find(v => {
      return v[1] === imgCoord;
    })[0];
  };

  /**
   * 가위바위보 변환
   */
  const changeHand = () => {
    if (imgCoord === rspCoords.rock) {
      setImgCoord(rspCoords.scissor);
    } else if (imgCoord === rspCoords.scissor) {
      setImgCoord(rspCoords.paper);
    } else if (imgCoord === rspCoords.paper) {
      setImgCoord(rspCoords.rock);
    }
  };

  const timerView = () =>
    round === 0 ? null : (
      <div>{cnt === 0 ? 'Go!!' : `${cnt}초 후 재시작 😊`}</div>
    );

  return (
    <>
      <div
        id="computer"
        style={{
          background: `url(http://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`,
        }}
      />
      <div>
        <button className="btn" onClick={onClickBtn('rock')}>
          바위
        </button>
        <button className="btn" onClick={onClickBtn('scissor')}>
          가위
        </button>
        <button className="btn" onClick={onClickBtn('paper')}>
          보
        </button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
      {timerView()}
    </>
  );
};

export default ScissorRockPaper;
