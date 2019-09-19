import React from 'react';
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom';

import GameMatcher from './GameMatcher';

const Games = () => {
  return (
    <BrowserRouter>
      <div>
        <Link to="/game/rsp?query=10&hello=min33sky&bye=react">가위바위보</Link>
        <Link to="/game/lotto">로또</Link>
        <Link to="/game/gameMacher">Game Macher</Link>
      </div>
      <div>
        <Route path="/game/:name" component={GameMatcher} />
      </div>
    </BrowserRouter>
  );
};

export default Games;
