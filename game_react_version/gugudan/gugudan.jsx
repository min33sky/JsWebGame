const React = require('react');

class Gugudan extends React.Component {
  inputRef = null;
  state = {
    first: Math.ceil(Math.random() * 9),
    second: Math.ceil(Math.random() * 9),
    value: '',
    result: '',
  };

  handleSubmit = e => {
    e.preventDefault();
    const { first, second, value, result } = this.state;
    if (parseInt(value) === first * second) {
      this.setState((state, props) => {
        return {
          first: Math.ceil(Math.random() * 9),
          second: Math.ceil(Math.random() * 9),
          result: '정답은 ' + state.value + '😍',
          value: '',
        };
      });
    } else {
      this.setState({
        value: '',
        result: '틀렸다 😂',
      });
    }

    this.inputRef.focus();
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleInputRef = ref => (this.inputRef = ref);

  render() {
    const { first, second, value, result } = this.state;
    const { handleChange, handleSubmit, handleInputRef } = this;
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div>
            문제: {first} X {second}
          </div>
          <input
            ref={handleInputRef}
            type="number"
            value={value}
            onChange={handleChange}
          />
          <button>입력</button>
          <div>결과 : {result}</div>
        </form>
      </>
    );
  }
}

module.exports = Gugudan;
