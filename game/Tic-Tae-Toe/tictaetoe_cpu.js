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
  let count = 1;
  let turn = false;

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

    // 몇 행 몇 열을 클릭했는지 알아내기
    const mark = turn ? 'O' : 'X';
    const colNum = Array.from(e.target.parentNode.childNodes).indexOf(e.target);
    const rowNum = Array.from(
      e.target.parentNode.parentNode.childNodes,
    ).indexOf(e.target.parentNode);

    // 화면과 데이터 업데이트
    e.target.textContent = mark;
    gameData[rowNum][colNum] = mark;

    let gameResult = getGameResult(gameData);
    console.log('게임 결과', gameResult);

    if (gameResult) {
      resultDOM.textContent = turn ? 'CPU 승리😭' : '당신의 승리😀';
      return;
    }

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

    // TODO : CPU의 턴

    // ***** 해당 턴의 마무리 작업 ***** //
    turn = !turn; // 턴 변경
    count++;
    resultDOM.textContent = turn ? 'CPU Turn' : 'Your Turn';
  }
}

/**
 * 승리 판별 함수
 */
function getGameResult(table) {
  let result = false;

  // 승리 조건 체크
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
