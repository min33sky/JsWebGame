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

const ROW = 24; // 테이블 세로
const COL = 10; // 테이블 가로
let timeOut = 0; // 타이머 관련 변수

let currentBlock = null;
let nextBlock = null;
let currentTopLeft = null; // 현재 블록 위치

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
  generateTable(true);
  generateTable(false);
  // 블록 생성하기
  generateBlock();
  // 화면 그리기
  draw();
}

/**
 * 게임 데이터를 담을 배열과 화면에 그릴 테이블을 생성하는 함수
 *
 * @param {boolean} option true 메인 화면, false 다음 블록 화면
 */
function generateTable(option) {
  /*
    ? fragment를 사용하는 것이 직접 DOM을 건드는 것보다 자원이 절약된다.
  */
  const tableDOM = document.createElement('table');
  const fragment = document.createDocumentFragment();

  let tableRow = option ? ROW : 3;
  let tableCol = option ? COL : 4;

  Array(tableRow)
    .fill(0)
    .forEach(() => {
      const trDOM = document.createElement('tr');
      Array(tableCol)
        .fill(0)
        .forEach(() => {
          const tdDOM = document.createElement('td');
          trDOM.appendChild(tdDOM);
        });
      fragment.appendChild(trDOM);

      option && gameData.push(Array(tableCol).fill(0));
    });

  tableDOM.appendChild(fragment);
  option ? gameDOM.appendChild(tableDOM) : nextBlockDOM.appendChild(tableDOM);
}

/**
 * 블록 생성
 */
function generateBlock() {
  if (!currentBlock) {
    currentBlock = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
  } else {
    currentBlock = nextBlock;
  }

  // 새로운 블록이 생성될 때마다 현재 블록 위치를 초기화 해준다.
  currentTopLeft = [-1, 3];

  currentBlock.shape[0].slice(1).forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (col) {
        gameData[rowIndex][colIndex + 3] = currentBlock.numCode;
      }
    });
  });

  // 다음 블록을 생성한다.
  generateNextBlock();
}

/**
 * 다음 블록을 생성하고 화면에 표시하는 함수
 */
function generateNextBlock() {
  const nextBlockTable = document.querySelector('#next-block table');
  nextBlock = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
  const nextBlockShape = nextBlock.shape[0];

  Array.from(nextBlockTable.childNodes).forEach((tr, i) => {
    Array.from(tr.childNodes).forEach((td, j) => {
      nextBlockTable.childNodes[i].childNodes[j].className = '';
      if (nextBlockShape[i][j]) {
        nextBlockTable.childNodes[i].childNodes[j].classList.add(
          BLOCK_COLORS[nextBlock.numCode - 1],
        );
      } else {
        nextBlockTable.childNodes[i].childNodes[j].className = '';
      }
    });
  });
}

/**
 * 화면에 블록을 그려주는 함수
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
    TODO : 블록이 고정된 후에 삭제 가능한 행이 있는지 확인

   */

  const nextTopLeft = [currentTopLeft[0] + 1, currentTopLeft[1]]; // 현재 위치에서 한 칸 아래
  const activeBlockCoords = []; // 현재 블록의 셀 좌표
  let moveableBlock = true;
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
        // 현재 블록은 움직일 수 있으므로 배열에 담아둔다.
        activeBlockCoords.push([i, j]);
        // 인덱스가 바닥을 넘어갈 경우 undefined
        if (isInvalidBlock(gameData[i + 1] && gameData[i + 1][j])) {
          moveableBlock = false;
        }
      }
    }
  }

  if (!moveableBlock) {
    // 움직일 수 없을 때 블록을 고정시키는 처리
    activeBlockCoords.forEach((cell) => {
      gameData[cell[0]][cell[1]] = gameData[cell[0]][cell[1]] * 10;
    });

    // TODO: 지울 블록이 있는지 확인

    // 다음 블록을 셍상
    generateBlock();
  } else {
    /*
     * 고정되지 않고 아래로 움직일 수 있는 블록일 경우
     * 아래 칸으로 이동시키고 현재 칸은 지워준다.
     */
    for (let i = ROW - 1; i >= 0; i--) {
      for (let j = 0; j < COL; j++) {
        if (gameData[i][j] > 0 && gameData[i + 1] && gameData[i][j] < 10) {
          gameData[i + 1][j] = gameData[i][j];
          gameData[i][j] = 0;
        }
      }
    }
    currentTopLeft = nextTopLeft;
    draw();
  }
}

/**
 * 이동할 수 있는 블록인지 확인하는 함수
 * @param {number} value
 */
const isActiveBlock = (value) => value > 0 && value < 10;

/**
 * 바닥을 지나간 블록이거나 이미 고정된 블록인지 확인하는 함수
 * @param {number || undefined} value
 */
const isInvalidBlock = (value) => {
  // console.log('isInvalidBlock 호출', value);
  return value === undefined || value >= 10;
};

/**************************************************************
 * 키보드 이벤트
 **************************************************************/
window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      const nextTopLeft = [currentTopLeft[0], currentTopLeft[1] - 1];
      let isMoveable = true;
      const currentBlockShape =
        currentBlock.shape[currentBlock.currentShapeIndex];

      for (
        let i = currentTopLeft[0];
        i < currentTopLeft[0] + currentBlockShape.length;
        i++
      ) {
        if (!isMoveable) break;
        for (
          let j = currentTopLeft[1];
          j < currentTopLeft[1] + currentBlockShape.length;
          j++
        ) {
          // ! 콘솔창에 경고 뜨는거 막기
          if (!gameData[i] || !gameData[i][j]) continue;

          if (
            isActiveBlock(gameData[i][j]) &&
            isInvalidBlock(gameData[i] && gameData[i][j - 1])
          ) {
            isMoveable = false;
          }
        }
      }

      // 이동할 수 있다면 블록 이동
      if (isMoveable) {
        currentTopLeft = nextTopLeft;
        gameData.forEach((row, i) => {
          row.forEach((col, j) => {
            if (gameData[i][j - 1] === 0 && col < 10) {
              gameData[i][j - 1] = col;
              gameData[i][j] = 0;
            }
          });
        });
        draw();
      }

      break;
    case 'ArrowRight':
      console.log('오른쪽');
      break;

    default:
      break;
  }
});

// ************************************************************************

init();
timeOut = setInterval(moveBlockDown, 200);
