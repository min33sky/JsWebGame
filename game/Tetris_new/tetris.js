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

const ROW = 25;
const COL = 10;
const timeOut = 0; // 타이머 관련 변수

let currentBlock = null; // 현재 블록
let startPosition = [0, 3];

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
  // TODO: 다음 블록이 있을 경우 다음 블록이 현재 블록으로 교체된다.
  // 블록 생성하기
  if (currentBlock) {
    // nextBlock?
  } else {
    currentBlock = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
  }
  console.log('현재 블록', currentBlock);

  // 시작 위치에 현재 블록 출력하기 [0, 3]
  console.log(currentBlock.shape[0]);

  currentBlock.shape[0].forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (col) {
        gameData[rowIndex][colIndex] = currentBlock.numCode;
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
      // 화면에 그려줄꺼야
      if (gameData[rowIndex][colIndex]) {
        tableDOM.childNodes[rowIndex].childNodes[colIndex].style.background =
          BLOCK_COLORS[gameData[rowIndex][colIndex] - 1];
        tableDOM.childNodes[rowIndex].childNodes[colIndex].textContent =
          gameData[rowIndex][colIndex];
      }
    });
  });
}

// ***************************************

init();
