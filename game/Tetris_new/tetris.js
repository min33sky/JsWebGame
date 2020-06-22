/*****************************************
 * 테트리스
 *****************************************/

/*
  TODO
  1. 게임이 진행 될 공간(테이블)을 생성한다. (데이터가 저장될 배열도 생성)
  2. 각 블록에 대한 데이터 생성
  3. 1초마다 블록이 아래로 내려간다.(하단에 고정된 블록은 움직이지 않는다.)
 */

const gameDOM = document.querySelector('#game');
const nextBlockDOM = document.querySelector('#next-block');
const gameData = []; // 게임 진행 데이터가 저장될 배열

const ROW = 20; // 테이블 세로
const COL = 10; // 테이블 가로
let timeOut = 0; // 타이머 관련 변수

let currentBlock = null; // 현재 블록
let currentTopLeft = [0, 3]; // 현재 위치

/**
 * 이동할 수 있는 블록인지 확인하는 함수
 * @param {number} value
 */
const isActiveBlock = (value) => value > 0 && value < 10;

/**
 * 바닥을 지나간 블록이거나 이미 고정된 블록인지 확인하는 함수
 * @param {number} value
 */
const isInvalidBlock = (value) => {
  console.log('isInvalidBlock 호출', value);
  return value === undefined || value >= 10;
};

// 블록 색깔
const BLOCK_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'navy',
  'violet',
];

// 블록 모양에 대한 데이터
const BLOCKS = [
  {
    name: 'O-SHAPED',
    numCode: 1,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
      ],
    ],
  },
  {
    name: 'T-SHAPED',
    numCode: 2,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ],
  },
  {
    name: 'S-SHAPED',
    numCode: 3,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
    ],
  },
  {
    name: 'Z-SHAPED',
    numCode: 4,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ],
  },
  {
    name: 'J-SHAPED',
    numCode: 5,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  {
    name: 'L-SHAPED',
    numCode: 6,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
    ],
  },
  {
    name: 'I-SHAPED',
    numCode: 7,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
    ],
  },
];

function init() {
  console.log('Game Start....');

  // 화면과 데이터 배열 생성
  generateTable();
  // 블록 생성하기
  generateBlock();
  // 화면 그리기
  draw();
}

/**
 * 게임 데이터를 담을 배열과 화면에 그릴 테이블을 생성하는 함수
 */
function generateTable() {
  /*
    ? fragment를 사용하는 것이 직접 DOM을 건드는 것보다 자원이 절약된다.
  */
  const tableDOM = document.createElement('table');
  const fragment = document.createDocumentFragment();

  Array(ROW)
    .fill(0)
    .forEach(() => {
      const trDOM = document.createElement('tr');
      Array(COL)
        .fill(0)
        .forEach(() => {
          const tdDOM = document.createElement('td');
          trDOM.appendChild(tdDOM);
        });
      fragment.appendChild(trDOM);
      gameData.push(Array(COL).fill(0));
    });

  tableDOM.appendChild(fragment);
  gameDOM.appendChild(tableDOM);
  console.log('현재 데이터', gameData);
}

/**
 * 블록 생성
 */
function generateBlock() {
  /*
    TODO:
    1. 다음 블록이 있을 경우 다음 블록이 현재 블록으로 교체된다.
    2. 제일 첫 열을 제거한 후 출력
  */
  // 블록 생성하기
  if (currentBlock) {
    // nextBlock?
  } else {
    currentBlock = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
  }

  // 시작 위치에 현재 블록 출력하기 [0, 3]
  console.log(currentBlock.shape[0]);

  currentBlock.shape[0].slice(1).forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (col) {
        // gameData[rowIndex][colIndex + 3] = currentBlock.numCode;
        gameData[rowIndex][colIndex + 3] = currentBlock.numCode;
      }
    });
  });

  console.log(gameData);
}

/**
 * 화면에 그려주는 함수
 */
function draw() {
  const tableDOM = document.querySelector('table');

  gameData.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      // 화면에 블록 그리기 (색깔 입히기)
      if (gameData[rowIndex][colIndex]) {
        tableDOM.childNodes[rowIndex].childNodes[colIndex].classList.add(
          BLOCK_COLORS[gameData[rowIndex][colIndex] - 1],
        );
        tableDOM.childNodes[rowIndex].childNodes[colIndex].textContent =
          gameData[rowIndex][colIndex];
      } else {
        tableDOM.childNodes[rowIndex].childNodes[colIndex].className = '';
        tableDOM.childNodes[rowIndex].childNodes[colIndex].textContent = '';
      }
    });
  });
}

/**
 * 1초마다 블록을 아래로 움직이는 함수
 */
function moveBlockDown() {
  /*
    TODO
    1. 블록이 아래까지 내려가면 다음 블록을 내린다.
   */

  const nextTopLeft = [currentTopLeft[0] + 1, currentTopLeft[1]]; // 현재 위치에서 한 칸 아래
  const activeBlock = []; // 고정 시킬 블록 좌표들
  let canGoDown = true; // 내려갈 수 있는 블록인지 판단하는 flag
  let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex]; // 현재 블록 모양

  for (
    let i = currentTopLeft[0];
    i < currentTopLeft[0] + currentBlockShape.length;
    i++
  ) {
    // 현재 위치에서 블록의 크기 만큼 범위를 제한한다.
    if (i < 0 || i >= ROW) continue;
    for (
      let j = currentTopLeft[1];
      j < currentTopLeft[1] + currentBlockShape.length;
      j++
    ) {
      /*
       * 1. 현재 블록이 움직일 수 있는 지 체크하기
       * 2. 현재 블록의 다음 위치가 움직일 수 있는지 확인하기 (바닥이거나 이미 블록이 있거나)
       */
      if (isActiveBlock(gameData[i][j])) {
        console.log('호출', i, j);
        // 현재 블록은 움직일 수 있으므로 배열에 담아둔다.
        activeBlock.push([i, j]);
        // 인덱스가 바닥을 넘어갈 경우 undefined
        if (isInvalidBlock(gameData[i + 1] && gameData[i + 1][j])) {
          console.log('못움직여', i + 1, gameData[i + 1]);
          canGoDown = false;
        }
      }
    }
  }

  if (!canGoDown) {
    // 움직일 수 없을 때 블록을 고정시키는 처리
    activeBlock.forEach((cell) => {
      gameData[cell[0]][cell[1]] = gameData[cell[0]][cell[1]] * 10;
    });
  } else {
    // * 아래로 내려갈 수 있는 블록 처리
    for (let i = ROW - 1; i >= 0; i--) {
      for (let j = 0; j < COL; j++) {
        if (gameData[i][j] > 0 && gameData[i + 1] && gameData[i][j] < 10) {
          gameData[i + 1][j] = gameData[i][j];
          // 현재 위치의 값은 지워준다.
          gameData[i][j] = 0;
        }
      }
    }
    currentTopLeft = nextTopLeft;
    draw();
  }
}

// ***************************************

init();
timeOut = setInterval(moveBlockDown, 200);
