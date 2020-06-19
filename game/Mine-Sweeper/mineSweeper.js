/**
 * 지뢰 찾기
 */

/*
  TODO:
  2. 셀 클릭 시 지뢰면 게임 끝 아니면 근처의 지뢰 개수 표시하기
  3. 타이머 기능
*/

// 셀의 상태
const CELL_STATUS = {
  NORMAL: 0,
  MINE: 1,
  CONFIRM: -1,
  EXCLAMATION: -2,
  QUESTION: -3,
  EXCLAMATION_MINE: -4, // 지뢰 있는 곳에 느낌표
  QUESTION_MINE: -5, // 지뢰 있는 곳에 물음표
};

function init() {
  console.log('Game Start....');
  const execDOM = document.querySelector('#exec');
  const theadDOM = document.querySelector('thead');
  const timerDOM = document.querySelector('#table #timer');
  const gameDOM = document.querySelector('#table tbody');
  const resultDOM = document.querySelector('#result');
  const gameData = [];
  let clickCellCount = 0; // 열린 셀의 개수
  let pause = false; // 게임 중단

  /*
   * 게임 시작 버튼 (게임 화면과 데이터 배열을 생성한다.)
   */
  execDOM.addEventListener('click', (e) => {
    e.preventDefault();

    // TODO: 이미 실행 중일 때는 지우고 다시 시작하기
    if (gameDOM.innerHTML !== '') {
      alert('게임이 실행중입니다.');
      return;
    }

    const row = document.querySelector('#row').value;
    const col = document.querySelector('#col').value;
    const mineNum = document.querySelector('#mine').value;

    for (let i = 0; i < row; i++) {
      const trDOM = document.createElement('tr');
      const tr = [];
      for (let j = 0; j < col; j++) {
        const tdDOM = document.createElement('td');
        tr.push(CELL_STATUS.NORMAL);
        tdDOM.addEventListener('click', clickCell);
        tdDOM.addEventListener('contextmenu', rightClickCell);
        trDOM.appendChild(tdDOM);
      }
      gameDOM.appendChild(trDOM);
      gameData.push(tr);
    }
    theadDOM.classList.remove('hidden');

    // 지뢰 생성 함수 호출
    const mineArr = generateMine(row, col, mineNum);
    console.log('지뢰 인덱스', mineArr);
    // 지뢰 심기
    plantMine(gameData, mineArr, gameDOM);
    console.log(gameData);
  });

  /**
   * 셀 클릭 리스너
   */
  function clickCell(e) {
    // * 임시로 지뢰를 클릭했을 때 지뢰 표시하기
    if (e.target.dataset.mine === 'X') {
      e.target.innerHTML = '💣';
    }

    if (pause) {
      console.log('이미 게임이 끝났습니다.');
      return;
    }

    // 클릭 좌표
    const row = Array.from(e.target.parentNode.parentNode.childNodes).indexOf(
      e.target.parentNode,
    );
    const col = Array.from(e.target.parentNode.childNodes).indexOf(e.target);
    const mineNum = document.querySelector('#mine').value;

    // 이미 열었거나 우클릭한 셀은 클릭 금지
    if (
      [
        CELL_STATUS.CONFIRM,
        CELL_STATUS.EXCLAMATION,
        CELL_STATUS.EXCLAMATION_MINE,
        CELL_STATUS.QUESTION,
        CELL_STATUS.QUESTION_MINE,
      ].includes(gameData[row][col])
    ) {
      console.log('이미 확인했으므로 클릭 못해요');
      return;
    }

    // * 정상적으로 열렸을 경우에 카운트 증가 (게임 종료 조건에 사용함)
    if (gameData[row][col] !== CELL_STATUS.CONFIRM) {
      clickCellCount++;
    }

    if (gameData[row][col] === CELL_STATUS.NORMAL) {
      // TODO: 지뢰 개수를 표시한다.
      const nearMineNumber = 0;
      gameData[row][col] = CELL_STATUS.CONFIRM;
      gameDOM.childNodes[row].childNodes[col].textContent = nearMineNumber;
    } else if (gameData[row][col] === CELL_STATUS.MINE) {
      pause = true;
      e.target.classList.add('red');
      gameDOM.childNodes[row].childNodes[col].textContent = '💣';
      resultDOM.textContent = '꽝! 개못하시네요 ㅡ_ㅡ';
      return;
    }

    // 게임 종료 판정
    if (clickCellCount === gameData.length * gameData[0].length - mineNum) {
      console.log('게임 종료: 너의 승리!!');
      pause = true;
      resultDOM.textContent = 'You WIN';
    }
  }

  /**
   * 셀 우클릭 리스너
   */
  function rightClickCell(e) {
    e.preventDefault();
    const row = Array.from(e.target.parentNode.parentNode.childNodes).indexOf(
      e.target.parentNode,
    );
    const col = Array.from(e.target.parentNode.childNodes).indexOf(e.target);

    if (gameData[row][col] === CELL_STATUS.NORMAL) {
      gameData[row][col] = CELL_STATUS.EXCLAMATION;
      gameDOM.childNodes[row].childNodes[col].textContent = '❗';
    } else if (gameData[row][col] === CELL_STATUS.EXCLAMATION) {
      gameData[row][col] = CELL_STATUS.QUESTION;
      gameDOM.childNodes[row].childNodes[col].textContent = '❓';
    } else if (gameData[row][col] === CELL_STATUS.EXCLAMATION_MINE) {
      gameData[row][col] = CELL_STATUS.QUESTION_MINE;
      gameDOM.childNodes[row].childNodes[col].textContent = '❓';
    } else if (gameData[row][col] === CELL_STATUS.QUESTION) {
      gameData[row][col] = CELL_STATUS.NORMAL;
      gameDOM.childNodes[row].childNodes[col].textContent = '';
    } else if (gameData[row][col] === CELL_STATUS.QUESTION_MINE) {
      gameData[row][col] = CELL_STATUS.MINE;
      gameDOM.childNodes[row].childNodes[col].textContent = '';
    } else if (gameData[row][col] === CELL_STATUS.MINE) {
      gameData[row][col] = CELL_STATUS.EXCLAMATION_MINE;
      gameDOM.childNodes[row].childNodes[col].textContent = '❗';
    }

    console.log('[우클릭] 셀의 상태', gameData[row][col]);
  }
}

/**
 * 지뢰 생성 함수
 */
function generateMine(row, col, mineNum) {
  const candidates = Array(col * row)
    .fill(0)
    .map((v, i) => i);

  let shuffled = [];

  while (candidates.length) {
    const index = Math.floor(Math.random() * candidates.length);
    shuffled.push(candidates.splice(index, 1)[0]);
  }

  shuffled = shuffled.slice(0, mineNum).sort((p, c) => p - c);

  return shuffled;
}

/**
 * 지뢰 심는 함수
 */
function plantMine(gameData, mineArr, gameDOM) {
  mineArr.forEach((mine) => {
    let row = Math.floor(mine / gameData[0].length);
    let col = Math.floor(mine % gameData[0].length);
    gameData[row][col] = CELL_STATUS.MINE;
    gameDOM.childNodes[row].childNodes[col].dataset.mine = 'X';
  });
}

// **************************************

init();
