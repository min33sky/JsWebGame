const table = document.querySelector('#table');
const score = document.querySelector('#score');
let data = [];
let insertData = [[], [], [], []];
let grade = 0;
let dragStart = false;
let draging = false;
let startOffset = [];
let endOffset = [];

// 초기화
function initialize() {
  data = [];
  score.textContent = '0';

  // 테이블 생성
  let fragment = document.createDocumentFragment();
  [1, 2, 3, 4].forEach(row => {
    let rowData = [];
    data.push(rowData);
    let tr = document.createElement('tr');
    [1, 2, 3, 4].forEach(col => {
      rowData.push(0);
      let td = document.createElement('td');
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });
  table.appendChild(fragment);
}

// 랜덤으로 빈 셀에 숫자를 채워넣는 함수
function randomCreate() {
  let emptyCellArr = []; // 빈 칸 위치를 담을 배열

  // 빈 칸 검색
  data.forEach((row, i) => {
    row.forEach((col, j) => {
      if (!col) {
        emptyCellArr.push([i, j]);
      }
    });
  });

  if (!emptyCellArr.length) {
    alert('게임 종료');
    table.innerHTML = '';
    initialize();
    return;
  }

  let randomCellArr =
    emptyCellArr[Math.floor(Math.random() * emptyCellArr.length)];
  data[randomCellArr[0]][randomCellArr[1]] = 2;
  draw();
}

// 화면 그려주는 함수
function draw() {
  data.forEach((row, i) => {
    row.forEach((col, j) => {
      if (col > 0) {
        table.children[i].children[j].textContent = col;
      } else {
        table.children[i].children[j].textContent = '';
      }
    });
  });
}

window.addEventListener('mousedown', e => {
  dragStart = true;
  startOffset = [e.clientX, e.clientY];
});

window.addEventListener('mousemove', e => {
  if (dragStart) draging = true;
});

window.addEventListener('mouseup', e => {
  endOffset = [e.clientX, e.clientY];

  let direction = '';
  let distanceX = endOffset[0] - startOffset[0];
  let distanceY = endOffset[1] - startOffset[1];

  // 방향 판단 (기울기 1을 기준으로 좌우인지 상하인지 판별)
  if (distanceX < 0 && Math.abs(distanceY) / Math.abs(distanceX) < 1) {
    direction = 'left';
  } else if (distanceX > 0 && Math.abs(distanceY) / Math.abs(distanceX) < 1) {
    direction = 'right';
  } else if (distanceY < 0 && Math.abs(distanceY) / Math.abs(distanceX) > 1) {
    direction = 'up';
  } else if (distanceY > 0 && Math.abs(distanceY) / Math.abs(distanceX) > 1) {
    direction = 'down';
  }

  console.log(distanceX, distanceY, direction);

  switch (direction) {
    case 'left':
      // 4개의 행을 담는 배열
      insertData = [[], [], [], []];

      // 가장 왼쪽 열의 데이터가 젤 왼쪽으로 가도록 만든다.
      data.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col) {
            if (
              insertData[i][insertData[i].length - 1] &&
              insertData[i][insertData[i].length - 1] === col
            ) {
              insertData[i][insertData[i].length - 1] *= 2;
              grade = parseInt(score.textContent, 10);
              score.textContent =
                grade + insertData[i][insertData[i].length - 1];
            } else {
              insertData[i].push(col);
            }
          }
        });
      });

      // 이동
      [1, 2, 3, 4].forEach((row, i) => {
        [1, 2, 3, 4].forEach((col, j) => {
          data[i][j] = insertData[i][j] || 0;
        });
      });
      break;

    case 'right':
      insertData = [[], [], [], []];

      // 가장 오른쪽의 데이터가 제일 왼쪽으로 가게 만든다.
      data.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col) {
            if (insertData[i][0] && insertData[i][0] === col) {
              insertData[i][0] *= 2;
              grade = parseInt(score.textContent, 10);
              score.textContent = grade + insertData[i][0];
            } else {
              insertData[i].unshift(col);
            }
          }
        });
      });

      // 이동
      [1, 2, 3, 4].forEach((row, i) => {
        [1, 2, 3, 4].forEach((col, j) => {
          data[i][3 - j] = insertData[i][j] || 0;
        });
      });
      break;

    case 'up':
      // 해당 열 값을 담을 배열 (1열[1행,2행,3행,4행], 2열[], ...)
      insertData = [[], [], [], []];

      data.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col) {
            if (
              insertData[j][insertData[j].length - 1] &&
              insertData[j][insertData[j].length - 1] === col
            ) {
              insertData[j][insertData[j].length - 1] *= 2;
              grade = parseInt(score.textContent, 10);
              score.textContent =
                grade + insertData[j][insertData[j].length - 1];
            } else {
              insertData[j].push(col);
            }
          }
        });
      });

      // 이동 (열,행 -> 행,열)
      [1, 2, 3, 4].forEach((row, i) => {
        [1, 2, 3, 4].forEach((col, j) => {
          data[j][i] = insertData[i][j] || 0;
        });
      });

      break;

    case 'down':
      // 해당 열 값을 저장할 배열
      insertData = [[], [], [], []];

      data.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col) {
            if (insertData[j][0] && insertData[j][0] === col) {
              insertData[j][0] *= 2;
              grade = parseInt(score.textContent, 10);
              score.textContent = grade + insertData[j][0];
            } else {
              insertData[j].unshift(col);
            }
          }
        });
      });

      [1, 2, 3, 4].forEach((row, i) => {
        [1, 2, 3, 4].forEach((col, j) => {
          data[3 - j][i] = insertData[i][j] || 0;
        });
      });
      break;

    default:
      break;
  }

  dragStart = false;
  draging = false;

  randomCreate();
  draw();
});

initialize();
randomCreate();
draw();
