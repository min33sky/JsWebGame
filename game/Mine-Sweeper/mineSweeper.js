/**
 * 지뢰 찾기
 */

/*
  TODO:
  1. 배열과 화면에 지뢰심기
  2. 셀 클릭 시 지뢰면 게임 끝 아니면 근처의 지뢰 개수 표시하기
  3. 타이머 기능
*/

function init() {
  console.log('Game Start....');
  const execDOM = document.querySelector('#exec');
  const theadDOM = document.querySelector('thead');
  const timerDOM = document.querySelector('#table #timer');
  const gameDOM = document.querySelector('#table tbody');
  const gameData = [];

  /*
   * 게임 시작 버튼 (게임 화면과 데이터 배열을 생성한다.)
   */
  execDOM.addEventListener('click', (e) => {
    // TODO: 이미 실행 중일 때는 지우고 다시 시작하기
    e.preventDefault();
    const row = document.querySelector('#row').value;
    const col = document.querySelector('#col').value;
    const mine = document.querySelector('#mine').value;

    for (let i = 0; i < row; i++) {
      const trDOM = document.createElement('tr');
      const tr = [];
      for (let j = 0; j < col; j++) {
        const tdDOM = document.createElement('td');
        tr.push(0);
        tdDOM.addEventListener('click', clickCell);
        trDOM.appendChild(tdDOM);
      }
      gameDOM.appendChild(trDOM);
      gameData.push(tr);
    }
    theadDOM.classList.remove('hidden');
  });
}

function clickCell(e) {
  console.log(e.target);
}

// **************************************

init();
