import React, { Component } from 'react';
import { getWinNumbers } from './util';
import Ball from './Ball';

class lotto extends Component {
  timeOut = []; // 각 타이머들을 담을 배열

  state = {
    winNumbers: getWinNumbers(),
    winBalls: [],
    bonus: null,
    redo: false,
  };

  componentDidMount() {
    this.getWinBalls();
  }

  /**
   * 새로 랜더링 될 때 마다 실행되는 라이프 사이클 함수
   */
  componentDidUpdate(prevProps, prevState) {
    // 재시작 버튼 클릭 시 실행
    if (!this.timeOut.length) this.getWinBalls();
  }

  componentWillUnmount() {
    this.timeOut.forEach(v => clearTimeout(v));
  }

  /**
   * 승리 번호를 배열에 추가하기
   */
  getWinBalls = () => {
    const { winNumbers } = this.state;
    for (let i = 0; i < winNumbers.length - 1; i++) {
      this.timeOut[i] = setTimeout(() => {
        this.setState(prev => ({
          winBalls: [...prev.winBalls, winNumbers[i]],
        }));
      }, (i + 1) * 1000);
    }
    this.timeOut[6] = setTimeout(() => {
      this.setState({
        bonus: winNumbers[winNumbers.length - 1],
        redo: true,
      });
    }, 7000);
  };

  /**
   * 재시작 버튼
   */
  onClickRedo = () => {
    this.setState({
      winNumbers: getWinNumbers(),
      winBalls: [],
      bonus: null,
      redo: false,
    });
    this.timeOut = [];
  };

  render() {
    const { winBalls, bonus, redo } = this.state;
    const { onClickRedo } = this;
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
        {redo ? <button onClick={onClickRedo}>한 번 더</button> : null}
      </>
    );
  }
}

export default lotto;
