import React from 'react';
import ReactDOM from 'react-dom';
import Tictaetoe from './Tictaetoe';
import { hot } from 'react-hot-loader/root';

const Hot = hot(Tictaetoe);

ReactDOM.render(<Hot />, document.querySelector('#root'));
