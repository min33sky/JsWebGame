const React = require('react');

class WordRelay extends React.Component {
  state = {
    text: 'Helo, webpack',
  };

  render() {
    return <div>{this.state.text}</div>;
  }
}

module.exports = WordRelay;
