import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import ReactionTest from './reactionTest';

const Hot = hot(ReactionTest);

ReactDOM.render(<Hot />, document.querySelector('#root'));
