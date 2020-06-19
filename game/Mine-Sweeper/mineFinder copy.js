/**
 * 지뢰 찾기
 *
 *
 */

const exec = document.querySelector('#exec');
const tbody = document.querySelector('#table tbody');

// Todo : 딕셔너리 프로퍼티 대문자로 바꾸기

const flags = {
  open: -1, // 확인한 셀
  question: -2, // 물음표
  exclamation: -3, // 느낌표
  questionMine: -4, // 지뢰있는 곳에 물음표
  exclamationMine: -5, // 지뢰있는 곳에 느낌표
  normal: 0, // 아직 확인하지 않은 셀
  mine: 1, // 지뢰
};
let dataSet = []; // 화면과 일치시킬 데이터
let progressFlag = false; // 게임 진행 플래그
let count = 0; // 셀 클릭 개수

/**
 * 지뢰 찾기 게임 시작 버튼 이벤트
 */
exec.addEventListener('click', function () {
  tbody.innerHTML = ''; // 지뢰 찾기 판 초기화
  dataSet = []; // 데이터 초기화
  document.querySelector('#result').textContent = '';
  progressFlag = false;
  count = 0;

  const col = parseInt(document.querySelector('#col').value);
  const row = parseInt(document.querySelector('#row').value);
  const mine = parseInt(document.querySelector('#mine').value);
  const mineArr = []; // 지뢰를 담을 배열

  /**
   * 지정한 크기의 지뢰를 담을 배열 생성하기
   * - Array(숫자) : 지정한 크기의 배열을 생성한다
   */
  const candidates = Array(col * row)
    .fill(0)
    .map((v, i) => i); // 배열 각 요소를 인덱스 값으로 채운다.

  // 지뢰 개수만큼 반복
  while (candidates.length > col * row - mine) {
    let idx = Math.floor(Math.random() * candidates.length);
    let number = candidates.splice(idx, 1)[0];
    mineArr.push(number);
  }
  console.log(
    'mineArr: ',
    mineArr.sort((a, b) => a - b),
  );

  // 지뢰 테이블 만들기
  for (let i = 0; i < row; i++) {
    let arr = [];
    let tr = document.createElement('tr');
    for (let j = 0; j < col; j++) {
      let td = document.createElement('td');
      arr.push(flags.normal);

      // 우클릭 시
      td.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (progressFlag) return;
        // * 현재 td의 위치를 알기 위해선 현재 tr을 알아야하고
        // * 현재 tr의 위치를 알기 위해선 tbody를 알아야한다.
        let ptr = e.currentTarget.parentNode;
        let ptbody = e.currentTarget.parentNode.parentNode;

        /*
         * Arraylike(유사배열)은 indexOf 메서드가 없으므로
         * Array.from() 메서드로 배열로 변환하거나
         * Array.prototype.indexOf.call() 메서드를 호출하여 해결한다
         * ex) Array.prototype.indexOf.call(ptr.children, e.currentTarget)
         */
        let ptdIdx = Array.from(ptr.children).indexOf(e.currentTarget);
        let ptrIdx = Array.from(ptbody.children).indexOf(ptr);

        if (
          e.currentTarget.textContent === '' ||
          e.currentTarget.textContent === 'X'
        ) {
          e.currentTarget.textContent = '!';
          if (dataSet[ptrIdx][ptdIdx] === flags.mine) {
            dataSet[ptrIdx][ptdIdx] = flags.exclamationMine;
          } else {
            dataSet[ptrIdx][ptdIdx] = flags.exclamation;
          }
        } else if (e.currentTarget.textContent === '!') {
          e.currentTarget.textContent = '?';
          if (dataSet[ptrIdx][ptdIdx] === flags.exclamationMine) {
            dataSet[ptrIdx][ptdIdx] = flags.questionMine;
          } else {
            dataSet[ptrIdx][ptdIdx] = flags.question;
          }
        } else if (e.currentTarget.textContent === '?') {
          // * 지뢰일 경우와 아닐 경우를 분리해서 처리한다
          console.log(dataSet[ptrIdx][ptdIdx]);
          if (
            dataSet[ptrIdx][ptdIdx] === flags.mine ||
            dataSet[ptrIdx][ptdIdx] === flags.questionMine ||
            dataSet[ptrIdx][ptdIdx] === flags.exclamationMine
          ) {
            e.currentTarget.textContent = 'X';
            dataSet[ptrIdx][ptdIdx] = flags.mine;
          } else {
            e.currentTarget.textContent = '';
            dataSet[ptrIdx][ptdIdx] = flags.normal;
          }
        }
      });

      // 셀 클릭 시
      td.addEventListener('click', (e) => {
        if (progressFlag) return;
        let ptr = e.currentTarget.parentNode;
        let ptbody = e.currentTarget.parentNode.parentNode;
        let ptdIdx = Array.from(ptr.children).indexOf(e.currentTarget);
        let ptrIdx = Array.from(ptbody.children).indexOf(ptr);

        if (count === col * row - mine) return; // 게임 종료
        // 우클릭 했거나 이미 연 셀의경우는 클릭 못함
        if (
          [
            flags.open,
            flags.exclamation,
            flags.question,
            flags.questionMine,
            flags.exclamationMine,
          ].includes(dataSet[ptrIdx][ptdIdx])
        ) {
          return;
        }

        // 오픈한 셀이 아닐경우에는 카운트 업
        if (dataSet[ptrIdx][ptdIdx] !== flags.open) count++;

        e.currentTarget.classList.add('opened');

        // 지뢰를 클릭했을 경우
        if (dataSet[ptrIdx][ptdIdx] === flags.mine) {
          e.currentTarget.textContent = '펑';
          progressFlag = true;
          document.querySelector('#result').textContent = '망했어요...😢😢😢';
        } else {
          // 지뢰가 아닐 경우 주위 지뢰 개수를 알려준다.
          let surrounds = [
            dataSet[ptrIdx][ptdIdx - 1],
            dataSet[ptrIdx][ptdIdx + 1],
          ];

          // 클릭 시 이미 확인한 셀 체크
          dataSet[ptrIdx][ptdIdx] = flags.open;

          /*
           * 배열 범위를 넘지 않을 경우에만 개수에 포함시킨다.
           * 2차원 배열일 경우 [행][열]에서 행이 존재하지 앟는다면 에러가 뜨지만
           * 열이 존재하지 않는다면 undefined를 리턴한다.
           */
          if (dataSet[ptrIdx - 1]) {
            surrounds = surrounds.concat([
              dataSet[ptrIdx - 1][ptdIdx - 1],
              dataSet[ptrIdx - 1][ptdIdx],
              dataSet[ptrIdx - 1][ptdIdx + 1],
            ]);
          }

          if (dataSet[ptrIdx + 1]) {
            surrounds = surrounds.concat([
              dataSet[ptrIdx + 1][ptdIdx - 1],
              dataSet[ptrIdx + 1][ptdIdx],
              dataSet[ptrIdx + 1][ptdIdx + 1],
            ]);
          }

          // 주변 지뢰 개수
          let numOfSurrondMines = surrounds.filter((e) => e === flags.mine)
            .length;

          // 지뢰 개수 화면에 출력 (숫자 0은 출력하지 않는다.)
          e.currentTarget.textContent = numOfSurrondMines || '';

          // 주변에 지뢰가 0이라면 주변도 함께 출력한다.
          if (numOfSurrondMines === 0) {
            let surrounds = [];
            if (tbody.children[ptrIdx - 1]) {
              surrounds = surrounds.concat([
                tbody.children[ptrIdx - 1].children[ptdIdx - 1],
                tbody.children[ptrIdx - 1].children[ptdIdx],
                tbody.children[ptrIdx - 1].children[ptdIdx + 1],
              ]);
            }
            surrounds = surrounds.concat([
              tbody.children[ptrIdx].children[ptdIdx - 1],
              tbody.children[ptrIdx].children[ptdIdx + 1],
            ]);
            if (tbody.children[ptrIdx + 1]) {
              surrounds = surrounds.concat([
                tbody.children[ptrIdx + 1].children[ptdIdx - 1],
                tbody.children[ptrIdx + 1].children[ptdIdx],
                tbody.children[ptrIdx + 1].children[ptdIdx + 1],
              ]);
            }

            /*
             * 주위에 지뢰가 없을 경우(0일 경우) 근처의 셀도 함께 열어준다.
             * 중복 계산을 피하기 위해 이미 확인 한 셀은 처리하지 않는다.
             */
            surrounds
              .filter((v) => !!v) // ** 배열의 undefined를 제거하는 코드
              .forEach((currentTarget) => {
                let ptr = currentTarget.parentNode;
                let ptbody = currentTarget.parentNode.parentNode;
                let ptdIdx = Array.from(ptr.children).indexOf(currentTarget);
                let ptrIdx = Array.from(ptbody.children).indexOf(ptr);
                // 이미 확인한 셀은 제외
                if (dataSet[ptrIdx][ptdIdx] !== flags.open) {
                  currentTarget.click();
                }
              });
          }
        }

        // 지뢰 제외 모든 셀을 확인 시
        if (count === col * row - mine) {
          document.querySelector('#result').textContent = '축하합니다...😊😊😊';
        }
      });
      tr.appendChild(td);
    }
    dataSet.push(arr);
    tbody.appendChild(tr);
  }

  /**
   * 지뢰 심기
   * - 지뢰인 배열 요소는 X로 표시
   */
  mineArr.forEach((mine) => {
    let i = mine >= col ? Math.floor(mine / col) : 0;
    let j = mine % col;
    dataSet[i][j] = flags.mine;
    tbody.children[i].children[j].textContent = 'X';
  });
  console.log(dataSet);
});
