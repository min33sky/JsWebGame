import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import scissorRockPaper from './scissorRockPaper';

const Hot = hot(scissorRockPaper);

ReactDOM.render(<Hot />, document.querySelector('#root'));
