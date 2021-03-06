const tetris = document.querySelector('#tetris');
const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');
let tetrisData = []; // 화면 데이터
let currentBlock;
let nextBlock;
let currentTopLeft = [0, 3]; // 블록이 시작되는 위치
let timer; // 타이머

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'navy', 'violet'];

const blocks = [
  {
    name: 's',
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
    name: 't',
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
    name: 'z',
    numCode: 3,
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
    name: 'zr',
    numCode: 4,
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
    name: 'l',
    numCode: 5,
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
    name: 'lr',
    numCode: 6,
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
    name: 'b',
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

// 움직일 수 있는 블록인지 아닌지 확인
const isActiveBlock = (value) => value > 0 && value < 10;
const isInvalidBlock = (value) => value === undefined || value >= 10;

// 초기화
function init() {
  // ? fragment에 만드는 이유?
  // ? 직접 DOM을 건드는 것보다 자원이 절약된다.
  const fragment = document.createDocumentFragment();

  [...Array(20).keys()].forEach((i) => {
    const tr = document.createElement('tr');
    fragment.appendChild(tr);
    [...Array(10).keys()].forEach((j) => {
      const td = document.createElement('td');
      tr.appendChild(td);
    });

    const column = Array(10).fill(0);
    tetrisData.push(column);
  });

  tetris.appendChild(fragment);
}

// 블록 생성
function generate() {
  if (!currentBlock) {
    // 다음 블록 종류 선택
    currentBlock = blocks[Math.floor(Math.random() * blocks.length)];
  } else {
    currentBlock = nextBlock;
  }

  currentBlock.currentShapeIndex = 0; // 블록 모양 초기화
  nextBlock = blocks[Math.floor(Math.random() * blocks.length)]; // 다음 블록 생성

  drawNextBlock(); // 다음 블록을 화면에 그린다.
  currentTopLeft = [-1, 3]; // 블록의 시작 위치 지정 (2행부터 블록 모양이 출력되므로 1열 위에서 시작)

  // 게임 오버 판별
  let isGameOver = false;
  currentBlock.shape[0].slice(1).forEach((row, i) => {
    row.forEach((col, j) => {
      if (col && tetrisData[i][j + 3]) {
        isGameOver = true;
      }
    });
  });

  // 블록 화면에 생성
  currentBlock.shape[0].slice(1).forEach((row, i) => {
    row.forEach((col, j) => {
      if (col) {
        tetrisData[i][j + 3] = currentBlock.numCode;
      }
    });
  });
  if (isGameOver) {
    // TODO : 게임 종료 및 타이머 종료
    clearInterval(timer);
    draw();
    alert('게임 끝');
  } else {
    draw();
  }
}

// 화면 그리기
function draw() {
  tetrisData.forEach((row, i) => {
    row.forEach((col, j) => {
      if (col > 0) {
        tetris.children[i].children[j].className =
          tetrisData[i][j] >= 10
            ? colors[tetrisData[i][j] / 10 - 1] // 고정된 블록들
            : colors[tetrisData[i][j] - 1]; // 움직이는 블록
      } else {
        tetris.children[i].children[j].className = '';
      }
    });
  });
}

// 다음 블록 그리기
function drawNextBlock() {
  const nextTable = document.querySelector('#next-block');
  nextTable.querySelectorAll('tr').forEach((row, i) => {
    Array.from(row.children).forEach((col, j) => {
      // 블록 첫 번째 형태의 첫 번째 열은 다 0이므로 검사할 필요가 없다.
      // 블록에 해당하는 셀의 숫자는 1~7
      if (nextBlock.shape[0][i] && nextBlock.shape[0][i][j] > 0) {
        nextTable.querySelectorAll('tr')[i].children[j].className =
          colors[nextBlock.numCode - 1];
      } else {
        nextTable.querySelectorAll('tr')[i].children[j].className = 'white';
      }
    });
  });
}

// 삭제 할 줄이 있는지 검사
function checkRows() {
  const fullRows = []; // 삭제 할 줄을 담을 배열
  tetrisData.forEach((row, i) => {
    let count = 0;
    row.forEach((col, j) => {
      if (col > 0) {
        count++;
      }
    });
    if (count === 10) {
      // 꽉 찼으므로 제거 대상이다.
      fullRows.push(i);
    }
  });

  const fullRowsCount = fullRows.length;
  tetrisData = tetrisData.filter((row, i) => !fullRows.includes(i));
  for (let i = 0; i < fullRowsCount; i++) {
    tetrisData.unshift(Array(10).fill(0));
  }
  let score = parseInt(document.querySelector('#score').textContent, 10);
  score += fullRowsCount ** 2;
  document.querySelector('#score').textContent = String(score);
}

// 블록을 아래로 움직이는 함수
function tick() {
  const nextTopLeft = [currentTopLeft[0] + 1, currentTopLeft[1]];
  const activeBlock = [];
  let canGoDown = true;
  let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
  for (
    let i = currentTopLeft[0];
    i < currentTopLeft[0] + currentBlockShape.length;
    i++
  ) {
    if (i < 0 || i >= 20) continue; // 범위 넘어가면 X
    for (
      let j = currentTopLeft[1];
      j < currentTopLeft[1] + currentBlockShape.length;
      j++
    ) {
      /*
       * 1. 현재 블록이 움직일 수 있는 블록인지 체크
       * 2. 아래로 움직일 수 없고 아래에 블록이 있을 때는 이동을 중지시킨다.
       */
      if (isActiveBlock(tetrisData[i][j])) {
        activeBlock.push([i, j]);
        if (isInvalidBlock(tetrisData[i + 1] && tetrisData[i + 1][j])) {
          canGoDown = false;
        }
      }
    }
  }

  // 아래 블록이 있으면
  if (!canGoDown) {
    activeBlock.forEach((block) => {
      tetrisData[block[0]][block[1]] *= 10; // 고정된 블록으로 바꿈
    });
    checkRows(); // 지워질 블록이 있는지 확인
    generate(); // 새 블록 생성
    return false;
  } else {
    // 블록을 아래로 이동
    for (let i = tetrisData.length - 1; i >= 0; i--) {
      const row = tetrisData[i];
      row.forEach((col, j) => {
        if (col < 10 && tetrisData[i + 1] && tetrisData[i + 1][j] < 10) {
          tetrisData[i + 1][j] = col;
          tetrisData[i][j] = 0;
        }
      });
    }
    currentTopLeft = nextTopLeft; // 현재 위치 변경
    draw(); // 다시 화면을 그린다.
    return true;
  }
}

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft': {
      const nextTopLeft = [currentTopLeft[0], currentTopLeft[1] - 1];
      let isMovable = true;
      let currentBlockShape =
        currentBlock.shape[currentBlock.currentShapeIndex];

      for (
        let i = currentTopLeft[0];
        i < currentTopLeft[0] + currentBlockShape.length;
        i++
      ) {
        // 왼쪽 공간 체크
        if (!isMovable) break;
        for (
          let j = currentTopLeft[1];
          j < currentTopLeft[1] + currentBlockShape.length;
          j++
        ) {
          // 범위 넘어가면 넘어감
          if (!tetrisData[i] || !tetrisData[i][j]) continue;

          if (
            isActiveBlock(tetrisData[i][j]) &&
            isInvalidBlock(tetrisData[i] && tetrisData[i][j - 1])
          ) {
            isMovable = false;
          }
        }
      }

      if (isMovable) {
        currentTopLeft = nextTopLeft;
        tetrisData.forEach((row, i) => {
          for (let j = 0; j < row.length; j++) {
            const col = row[j];
            if (tetrisData[i][j - 1] === 0 && col < 10) {
              tetrisData[i][j - 1] = col;
              tetrisData[i][j] = 0;
            }
          }
        });
        draw();
      }

      break;
    }

    case 'ArrowRight': {
      const nextTopLeft = [currentTopLeft[0], currentTopLeft[1] + 1];
      let isMovable = true;
      let currentBlockShape =
        currentBlock.shape[currentBlock.currentShapeIndex];

      for (
        let i = currentTopLeft[0];
        i < currentTopLeft[0] + currentBlockShape.length;
        i++
      ) {
        if (!isMovable) break;
        for (
          let j = currentTopLeft[1];
          j < currentTopLeft[1] + currentBlockShape.length;
          j++
        ) {
          // 범위 넘어가면 넘어감
          if (!tetrisData[i] || !tetrisData[i][j]) continue;

          if (
            isActiveBlock(tetrisData[i][j]) &&
            isInvalidBlock(tetrisData[i] && tetrisData[i][j + 1])
          ) {
            isMovable = false;
          }
        }
      }

      if (isMovable) {
        currentTopLeft = nextTopLeft;
        tetrisData.forEach((row, i) => {
          for (let j = row.length - 1; j >= 0; j--) {
            const col = row[j];
            if (tetrisData[i][j + 1] === 0 && col < 10) {
              tetrisData[i][j + 1] = col;
              tetrisData[i][j] = 0;
            }
          }
        });
        draw();
      }
      break;
    }

    case 'ArrowDown': {
      // 블록 한 칸 내림
      tick();
    }

    default:
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowUp': {
      let currentBlockShape =
        currentBlock.shape[currentBlock.currentShapeIndex];

      let isChangeable = true;

      const nextShapeIndex =
        currentBlock.currentShapeIndex + 1 === currentBlock.shape.length
          ? 0
          : currentBlock.currentShapeIndex + 1;

      const nextBlockShape = currentBlock.shape[nextShapeIndex];

      // 형태 변환이 가능한 블록인지 체크한다.
      for (
        let i = currentTopLeft[0];
        i < currentTopLeft[0] + currentBlockShape.length;
        i++
      ) {
        // 움직일 수 없으면 종료
        if (!isChangeable) break;

        for (
          let j = currentTopLeft[1];
          j < currentTopLeft[1] + currentBlockShape.length;
          j++
        ) {
          // 범위 밖이면 스킵
          if (!tetrisData[i]) continue;

          // 다음 블록 형태의 셀이 존재하지만 움직일 수 없는 블록인지 체크
          if (
            nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]] > 0 &&
            isInvalidBlock(tetrisData[i] && tetrisData[i][j])
          ) {
            isChangeable = false;
          }
        }
      }

      if (isChangeable) {
        // 전환했을 때 위치가 테이블 시작 위치 전이라면 한 칸 내린다. (블록 깨짐 방지)
        while (currentTopLeft[0] < 0) {
          tick();
        }
        for (
          let i = currentTopLeft[0];
          i < currentTopLeft[0] + currentBlockShape.length;
          i++
        ) {
          for (
            let j = currentTopLeft[1];
            j < currentTopLeft[1] + currentBlockShape.length;
            j++
          ) {
            // 범위 밖은 스킵
            if (!tetrisData[i]) continue;

            // 다음 블록의 형태 설정
            // nextBlockShape[0 ~ 3 or 4][0 ~ 3 or 4]
            let nextBlockShapeCell =
              nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]];

            // 다음 형태는 있는데 현재 칸이 없으면 셀을 채운다
            if (nextBlockShapeCell > 0 && tetrisData[i][j] === 0) {
              tetrisData[i][j] = currentBlock.numCode;
            } else if (
              // 다음 형태는 없는데 현재 칸이 있으면 셀을 비운다.
              nextBlockShapeCell === 0 &&
              tetrisData[i][j] &&
              tetrisData[i][j] < 10
            ) {
              tetrisData[i][j] = 0;
            }
          }
        }
        currentBlock.currentShapeIndex = nextShapeIndex;
      }

      draw();
      break;
    }

    case 'Space': {
      // 한 번에 떨구기
      while (tick()) {}
      break;
    }

    default:
      break;
  }
});

stopBtn.addEventListener('click', () => {
  clearInterval(timer);
});

startBtn.addEventListener('click', () => {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(tick, 1000);
});

// *************************************************************

init();
generate();
timer = setInterval(tick, 1000);
