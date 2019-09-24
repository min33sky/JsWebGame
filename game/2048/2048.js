const table = document.querySelector('#table');
const score = document.querySelector('#score');
let data = [];
let grade = 0;
let newData = [[], [], [], []];

function initialize() {
  data = [];
  score.textContent = '0';
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

let dragStart = false;
let draging = false;
let startOffset = [];
let endOffset = [];

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
      newData = [[], [], [], []];

      data.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col) {
            if (
              newData[i][newData[i].length - 1] &&
              newData[i][newData[i].length - 1] === col
            ) {
              newData[i][newData[i].length - 1] *= 2;
              grade = parseInt(score.textContent, 10);
              score.textContent = grade + newData[i][newData[i].length - 1];
            } else {
              newData[i].push(col);
            }
          }
        });
      });

      // 이동
      [1, 2, 3, 4].forEach((row, i) => {
        [1, 2, 3, 4].forEach((col, j) => {
          data[i][j] = newData[i][j] || 0;
        });
      });
      break;

    case 'right':
      newData = [[], [], [], []];

      data.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col) {
            if (newData[i][0] && newData[i][0] === col) {
              newData[i][0] *= 2;
              grade = parseInt(score.textContent, 10);
              score.textContent = grade + newData[i][0];
            } else {
              newData[i].unshift(col);
            }
          }
        });
      });

      // 이동
      [1, 2, 3, 4].forEach((row, i) => {
        [1, 2, 3, 4].forEach((col, j) => {
          data[i][3 - j] = newData[i][j] || 0;
        });
      });
      break;

    case 'up':
      // 해당 열 값을 담을 배열 (1열[1행,2행,3행,4행], 2열[], ...)
      newData = [[], [], [], []];

      data.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col) {
            if (
              newData[j][newData[j].length - 1] &&
              newData[j][newData[j].length - 1] === col
            ) {
              newData[j][newData[j].length - 1] *= 2;
              grade = parseInt(score.textContent, 10);
              score.textContent = grade + newData[j][newData[j].length - 1];
            } else {
              newData[j].push(col);
            }
          }
        });
      });

      // 이동 (열,행 -> 행,열)
      [1, 2, 3, 4].forEach((row, i) => {
        [1, 2, 3, 4].forEach((col, j) => {
          data[j][i] = newData[i][j] || 0;
        });
      });

      break;

    case 'down':
      newData = [[], [], [], []];

      data.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col) {
            if (newData[j][0] && newData[j][0] === col) {
              newData[j][0] *= 2;
              grade = parseInt(score.textContent, 10);
              score.textContent = grade + newData[j][0];
            } else {
              newData[j].unshift(col);
            }
          }
        });
      });

      console.log(newData);

      [1, 2, 3, 4].forEach((row, i) => {
        [1, 2, 3, 4].forEach((col, j) => {
          data[3 - j][i] = newData[i][j] || 0;
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
