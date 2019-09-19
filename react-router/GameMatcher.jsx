import React from 'react';
import RSP from '../game_react_version/scissor_rock_paper/scissorRockPaper_class';
import Lotto from '../game_react_version/lotto/lotto_class';

const GameMatcher = props => {
  // queryString Parsing
  console.log(props.location.search);
  const urlSearchParams = new URLSearchParams(props.location.search.slice(1));
  console.log(urlSearchParams.get('hello'));

  if (props.match.params.name === 'rsp') {
    return <RSP />;
  } else if (props.match.params.name === 'lotto') {
    return <Lotto />;
  }

  return <div>일치하는 게임이 없습니다.</div>;
};

export default GameMatcher;
