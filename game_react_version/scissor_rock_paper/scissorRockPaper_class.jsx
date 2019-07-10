import React, { Component } from 'react';

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

class ScissorRockPaper extends Component {
  state = {
    imgCoord: rspCoords.rock,
    score: 0,
    result: '',
  };

  interval = null;

  componentDidMount() {
    this.interval = setInterval(this.changeHand, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /**
   * 사용자 버튼 클릭 메서드
   * : 함수를 리턴하는 함수
   */
  onClickBtn = choice => () => {
    clearInterval(this.interval);
    const { imgCoord } = this.state;
    /**
     * TODO
     * 1. 사용자와 컴퓨터가 고른 것을 변수에 저장
     * 2. 승리 판별
     * 3. 점수 변경
     * 4. 다시 재시작
     */
    const user = scores[choice];
    const cpu = scores[this.selectCPU(imgCoord)];
    if (user === cpu) {
      // 비김
      this.setState({
        result: 'Draw 😒',
      });
    } else if ([1, -2].includes(user - cpu)) {
      // 패배
      this.setState(prev => ({
        result: 'You Lose.. 🤢',
        score: prev.score - 1,
      }));
    } else {
      // 승리
      this.setState(prev => ({
        result: 'You Win!! 😍',
        score: prev.score + 1,
      }));
    }

    // 2초뒤 재시작
    setTimeout(() => {
      this.interval = setInterval(this.changeHand, 100);
    }, 2000);
  };

  /**
   * CPU가 고른 가위바위보
   */
  selectCPU = imgCoord => {
    // cpu가 선택한 것을 알기 위해선 현재 정지된 좌표를 이용하면 된다.
    return Object.entries(rspCoords).find(v => {
      return v[1] === imgCoord;
    })[0];
  };

  /**
   * 가위바위보 변환 메서드
   */
  changeHand = () => {
    const { imgCoord } = this.state; // 상태 값을 주기적으로 불러온다.
    if (imgCoord === rspCoords.rock) {
      this.setState({
        imgCoord: rspCoords.scissor,
      });
    } else if (imgCoord === rspCoords.scissor) {
      this.setState({
        imgCoord: rspCoords.paper,
      });
    } else if (imgCoord === rspCoords.paper) {
      this.setState({
        imgCoord: rspCoords.rock,
      });
    }
  };

  render() {
    const { imgCoord, result, score } = this.state;
    const { onClickBtn } = this;
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
      </>
    );
  }
}

export default ScissorRockPaper;
