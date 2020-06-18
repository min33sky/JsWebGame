/**
 * Tic-Tae-Toe
 *
 */

const ROW = 3;
const COL = 3;

function init() {
  console.log('Game Start...');
  const gameDOM = document.querySelector('#game');
  const resultDOM = document.querySelector('#result');
  const tableDOM = document.createElement('table');
  const gameData = []; // 게임 상태를 담을 배열
  let count = 0;
  let turn = false;
  let finishFlag = false;

  // 테이블 생성하기
  for (let i = 0; i < ROW; i++) {
    const trDOM = document.createElement('tr');
    const trData = [];
    for (let j = 0; j < COL; j++) {
      const tdDOM = document.createElement('td');
      tdDOM.addEventListener('click', clickTable);
      trData.push(tdDOM);
      trDOM.appendChild(tdDOM);
    }
    gameData.push(trData);
    tableDOM.appendChild(trDOM);
  }
  gameDOM.appendChild(tableDOM);
  resultDOM.textContent = 'Your Turn';

  /**
   * 클릭 리스너
   */
  function clickTable(e) {
    if (e.target.textContent !== '') {
      console.log('이미 클릭한 곳');
      return;
    }

    if (finishFlag) return; // 게임이 끝났으면 클릭 금지

    // 몇 행 몇 열을 클릭했는지 알아내기
    let mark = turn ? 'O' : 'X';
    const colNum = Array.from(e.target.parentNode.childNodes).indexOf(e.target);
    const rowNum = Array.from(
      e.target.parentNode.parentNode.childNodes,
    ).indexOf(e.target.parentNode);

    // 화면과 데이터 업데이트
    e.target.textContent = mark;
    gameData[rowNum][colNum] = mark;

    // 게임 승부 판단
    let gameResult = getGameResult(gameData);
    let gameOver = finishOrProgress(gameResult);
    if (gameOver) return;

    /*
      빈 칸이 있는지 체크 (배열에 'O', 'X'만 들어있으면 게임 중단)
      */
    if (count === 9) {
      resultDOM.textContent = '무승부! (3초 후에 다시 시작)';
      setTimeout(() => {
        gameDOM.innerHTML = '';
        resultDOM.innerHTML = '';
        init();
      }, 3000);

      return;
    }
    console.log(count);

    setTimeout(() => {
      console.log('컴퓨터의 턴');
      mark = turn ? 'O' : 'X';

      const markingPossible = []; // 마킹 가능한 곳을 담을 배열
      gameData.forEach((tr, i) => {
        tr.forEach((td, j) => {
          if (!['O', 'X'].includes(gameData[i][j])) {
            markingPossible.push([i, j]);
          }
        });
      });

      // 가능한 공간에 마킹한다.
      const coords =
        markingPossible[Math.floor(Math.random() * markingPossible.length)];

      // 화면과 데이터 배열에 마킹 추가
      gameData[coords[0]][coords[1]] = mark;

      const tb = document.querySelector('table');
      tb.childNodes[coords[0]].childNodes[coords[1]].textContent = mark;

      // 승부 판별
      gameResult = getGameResult(gameData);
      gameOver = finishOrProgress(gameResult);
      if (gameOver) return;
      console.log(count);
      console.log('내 턴');
      // ***** 게임종료가 아닐 때 다음CPU Turn' : 'Your Turn';
    }, 1000);
  }

  function finishOrProgress(gameResult) {
    if (gameResult) {
      finishFlag = true;
      resultDOM.textContent = turn ? 'YOU LOSE😭' : 'YOU WIN😀';
      return true;
    } else {
      // ***** 게임종료가 아닐 때 다음 턴을 위한 준비 작업 ***** //
      turn = !turn; // 턴 변경
      count++;
      resultDOM.textContent = turn ? 'CPU Turn' : 'Your Turn';
      return false;
    }
  }
}

/**
 * 승리 판별 함수
 */
function getGameResult(table) {
  let result = false;

  // 승리 조건 체크 (가로, 새로, 대각선값의 일치)
  if (table[0][0] === table[0][1] && table[0][1] === table[0][2]) {
    result = true;
  } else if (table[1][0] === table[1][1] && table[1][1] === table[1][2]) {
    result = true;
  } else if (table[2][0] === table[2][1] && table[2][1] === table[2][2]) {
    result = true;
  } else if (table[0][0] === table[1][0] && table[1][0] === table[2][0]) {
    result = true;
  } else if (table[0][1] === table[1][1] && table[1][1] === table[2][1]) {
    result = true;
  } else if (table[0][2] === table[1][2] && table[1][2] === table[2][2]) {
    result = true;
  } else if (table[0][0] === table[1][1] && table[1][1] === table[2][2]) {
    result = true;
  } else if (table[0][2] === table[1][1] && table[1][1] === table[2][0]) {
    result = true;
  }

  return result;
}

// ***************************************

init();
