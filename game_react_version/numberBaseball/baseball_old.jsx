const React = require('react');
const Tries = require('./Tries');
const { getNumbers } = require('./lib');

class BaseBall extends React.Component {
  inputRef = null;
  state = {
    value: '',
    answer: getNumbers(),
    tries: [],
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { value, answer, tries } = this.state;
    if (value === answer.join('')) {
      // 일치하면 홈런
      this.setState(prevState => ({
        answer: getNumbers(),
        value: '',
        tries: [...prevState.tries, { try: value, result: '홈런!' }],
      }));
    } else {
      let inputValue = value.split('').map(e => parseInt(e));
      let strike = 0;
      let ball = 0;
      // 10번 이상 실패시 게임 종료
      if (tries.length >= 10) {
        this.setState(prevState => ({
          tries: [
            ...prevState.tries,
            { try: value, result: `정답은 ${answer} 였습니다.` },
          ],
        }));
        alert('실패.. 재시작 합니다잉~');
        this.setState({
          value: '',
          anser: getNumbers(),
          tries: [],
        });
      } else {
        for (let i = 0; i < answer.length; i++) {
          if (inputValue[i] === answer[i]) {
            strike++;
          } else if (answer.includes(inputValue[i])) {
            ball++;
          }
        }
        this.setState(prevState => ({
          value: '',
          tries: [
            ...prevState.tries,
            { try: value, result: `${strike}스트라이크 ${ball}볼` },
          ],
        }));
      }
    }

    this.inputRef.focus();
  };

  handleInputRef = ref => (this.inputRef = ref);

  render() {
    const { value, tries } = this.state;
    const { handleInputRef, handleChange, handleSubmit } = this;
    return (
      <>
        <form onSubmit={handleSubmit}>
          <label htmlFor="label">입력: </label>
          <input
            type="number"
            ref={handleInputRef}
            maxLength={4}
            value={value}
            onChange={handleChange}
          />
          <button>클릭</button>
        </form>
        <div>시도 : {tries.length}</div>
        <Tries tries={tries} />
      </>
    );
  }
}

module.exports = BaseBall;
