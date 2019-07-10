import React, { Component } from 'react';

class ReactionTest extends Component {
  state = {
    state: 'waiting',
    message: '클릭해서 시작!',
    result: [],
  };

  startTime = null;
  endTime = null;
  timeOut = null;

  /**
   * 화면 클릭 메서드
   */
  onClickScreen = () => {
    const { state } = this.state;
    if (state === 'waiting') {
      this.setState({
        state: 'ready',
        message: '초록색이 되면 클릭하세요.',
      });
      this.timeOut = setTimeout(() => {
        this.setState({
          state: 'now',
          message: '지금 클릭',
        });
        this.startTime = new Date();
      }, Math.floor(Math.random() * 1000) + 2000);
    } else if (state === 'ready') {
      clearTimeout(this.timeOut);
      this.setState({
        state: 'waiting',
        message: '너무 빨리 클릭했어요.....',
      });
    } else if (state === 'now') {
      this.endTime = new Date();
      this.setState(prevState => ({
        state: 'waiting',
        message: '완료.. 클릭하면 재시작합니다.',
        result: [...prevState.result, this.endTime - this.startTime],
      }));
    }
  };

  renderAverage = () => {
    const { result } = this.state;
    return result.length === 0 ? null : (
      <div>평균 시간: {result.reduce((a, c) => a + c) / result.length}ms</div>
    );
  };

  render() {
    const { state, message } = this.state;
    const { onClickScreen, renderAverage } = this;
    return (
      <>
        <div id="screen" className={state} onClick={onClickScreen}>
          {message}
        </div>
        {renderAverage()}
      </>
    );
  }
}

export default ReactionTest;
