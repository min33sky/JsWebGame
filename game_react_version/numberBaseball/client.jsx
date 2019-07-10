import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import Baseball from './baseball';

const Hot = hot(Baseball);

ReactDOM.render(<Hot />, document.querySelector('#root'));
