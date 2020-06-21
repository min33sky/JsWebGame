/**********************************************************
 * 지뢰 찾기
 **********************************************************/

const execDOM = document.querySelector('#exec');
const theadDOM = document.querySelector('thead');
const timerDOM = document.querySelector('#table #timer');
const gameDOM = document.querySelector('#table tbody');
const resultDOM = document.querySelector('#result');
const difficultyDOM = document.querySelector('#difficulty');
const gameData = [];

let mineArr = []; // 지뢰들이 있는 셀
let mineNum = 0;
let row = 0;
let col = 0;
let clickCellCount = 0; // 열린 셀의 개수
let pause = false; // 게임 중단
let gameTimeOut = null;
let startTime = 0; // 시간 체크를 위한 변수들

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

// 난이도별 게임 설정
const GAME_SETTING = {
  easy: { row: 4, col: 4, mine: 4 },
  normal: { row: 6, col: 6, mine: 8 },
  hard: { row: 8, col: 8, mine: 10 },
};

function init() {
  console.log('Game Start....');

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

    const difficulty =
      GAME_SETTING[difficultyDOM.options[difficultyDOM.selectedIndex].value];

    row = difficulty.row;
    col = difficulty.col;
    mineNum = difficulty.mine;

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
    // 타이머를 화면에 보여준다.
    theadDOM.classList.remove('hidden');

    gameTimeOut = setInterval(() => {
      startTime += 1;
      timerDOM.textContent = startTime;
    }, 1000);

    // 지뢰 생성 함수 호출
    mineArr = generateMine(row, col, mineNum);
    // 지뢰 심기
    plantMine(gameData, mineArr, gameDOM);
  });

  /**
   * 셀 클릭 리스너
   */
  function clickCell(e) {
    if (pause) {
      console.log('이미 게임이 끝났습니다.');
      return;
    }

    /*
     * 현재 클릭 좌표
     */
    const row = Array.from(e.target.parentNode.parentNode.childNodes).indexOf(
      e.target.parentNode,
    );
    const col = Array.from(e.target.parentNode.childNodes).indexOf(e.target);

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
      console.log('이미 확인했거나 우클릭 처리했으므로 클릭 금지  ');
      return;
    }

    // * 정상적으로 열렸을 경우에 카운트 증가 (게임 종료 조건에 사용함)
    if (gameData[row][col] !== CELL_STATUS.CONFIRM) {
      clickCellCount++;
    }

    if (gameData[row][col] === CELL_STATUS.NORMAL) {
      // 클릭한 셀의 주변 셀들을 담을 배열
      const surroundingCells = [gameData[row][col - 1], gameData[row][col + 1]];

      /*
       * 배열 범위를 넘지 않을 경우에만 개수에 포함시킨다.
       * 2차원 배열일 경우 [행][열]에서 행이 존재하지 앟는다면 에러가 뜨지만
       * 열이 존재하지 않는다면 undefined를 리턴한다.
       */
      if (gameData[row - 1]) {
        surroundingCells.push(
          gameData[row - 1][col - 1],
          gameData[row - 1][col],
          gameData[row - 1][col + 1],
        );
      }

      if (gameData[row + 1]) {
        surroundingCells.push(
          gameData[row + 1][col - 1],
          gameData[row + 1][col],
          gameData[row + 1][col + 1],
        );
      }

      const nearMineNumber = surroundingCells.filter((cell) =>
        [
          CELL_STATUS.MINE,
          CELL_STATUS.QUESTION_MINE,
          CELL_STATUS.EXCLAMATION_MINE,
        ].includes(cell),
      ).length;

      /*  화면엔 근처 지뢰 개수를, 데이터 배열엔 확인한 셀 체크 */
      e.target.classList.add('opened');
      gameData[row][col] = CELL_STATUS.CONFIRM;
      gameDOM.childNodes[row].childNodes[col].textContent =
        nearMineNumber !== 0 ? nearMineNumber : '';

      /*
       * 주변에 지뢰가 없을 경우 주변 셀도 함께 열어준다.
       */
      if (nearMineNumber === 0) {
        const surroundingDOM = [];
        if (gameDOM.childNodes[row - 1]) {
          surroundingDOM.push(
            gameDOM.childNodes[row - 1].childNodes[col - 1],
            gameDOM.childNodes[row - 1].childNodes[col],
            gameDOM.childNodes[row - 1].childNodes[col + 1],
          );
        }
        surroundingDOM.push(
          gameDOM.childNodes[row].childNodes[col - 1],
          gameDOM.childNodes[row].childNodes[col + 1],
        );
        if (gameDOM.childNodes[row + 1]) {
          surroundingDOM.push(
            gameDOM.childNodes[row + 1].childNodes[col - 1],
            gameDOM.childNodes[row + 1].childNodes[col],
            gameDOM.childNodes[row + 1].childNodes[col + 1],
          );
        }

        // 주변 셀들을 다 클릭
        surroundingDOM
          .filter((v) => !!v) // ? 배열에서 Undefined 제거하는 Trick
          .forEach((currentTarget) => {
            // 현재 지점의 좌표를 알아낸 후 열린 셀이 아니라면 클릭해준다.
            const ptbody = currentTarget.parentNode.parentNode;
            const ptr = currentTarget.parentNode;
            const ptrIndex = Array.from(ptbody.childNodes).indexOf(ptr);
            const ptdIndex = Array.from(ptr.childNodes).indexOf(currentTarget);
            if (gameData[ptrIndex][ptdIndex] !== CELL_STATUS.CONFIRM) {
              currentTarget.click();
            }
          });
      }
    } else if (gameData[row][col] === CELL_STATUS.MINE) {
      /*
       * 지뢰를 클릭 시 게임 종료
        - 게임을 중단시키고 모든 지뢰를 화면에 보여준다.
        - 현재 클릭한 지뢰는 빨간색 배경으로 포인트를 준다.
       */
      clearTimeout(gameTimeOut);
      pause = true;
      gameDOM.childNodes[row].childNodes[col].classList.add('red');
      gameDOM.childNodes[row].childNodes[col].textContent = '💣';
      plantMine(gameData, mineArr, gameDOM, true);
      resultDOM.textContent = '꽝! 개못하시네요 ㅡ_ㅡ';
      return;
    }

    /*
     * 게임 종료 판정
     */
    if (clickCellCount === gameData.length * gameData[0].length - mineNum) {
      clearTimeout(gameTimeOut);
      pause = true;
      resultDOM.textContent = 'You WIN';
    }
  }

  /**
   * 셀 우클릭 함수
   * - 느낌표, 물음표 처리
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
  }
}

/**
 * 지뢰를 생성하고 지뢰들을 담은 배열을 리턴한다.
 * @param {number} row 행의 개수
 * @param {number} col 열의 개수
 * @param {number} mineNum 지뢰 개수
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
 * 지뢰를 심는 함수
 * @param {array} gameData 셀 상태를 저장하는 배열
 * @param {Array} mineArr 지뢰 위치를 저장한 배열
 * @param {HTMLElement} gameDOM 게임 화면을 보여줄 DOM
 * @param {boolean} gameEnd 게임 종료 시 모든 지뢰를 표시하기 위한 변수
 */
function plantMine(gameData, mineArr, gameDOM, gameEnd) {
  mineArr.forEach((mine) => {
    let row = Math.floor(mine / gameData[0].length);
    let col = Math.floor(mine % gameData[0].length);
    gameData[row][col] = CELL_STATUS.MINE;
    if (gameEnd) {
      gameDOM.childNodes[row].childNodes[col].textContent = '💣';
    }
  });
}

// ********************************************************************************

init();
