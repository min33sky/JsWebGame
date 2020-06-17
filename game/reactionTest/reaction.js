/**
 * 반응 속도 테스트
 *
 * 1. 화면을 클릭하면 색깔이 바뀌며 준비상태가 된다.
 * 2. 몇 초후에 색깔이 바뀌면서 누르세요 화면으로 변경된다.
 * 3. 제대로 클릭하면 성공. 늦거나 안누르면 실패
 * 4. 3번 반복
 * 5. 평균 소요 시간 체크
 *
 */

/**
 * ! 비동기 함수는 호출스택(call Stack)에 들어갔다 바로 나간다.
 * callStack에서 click 이벤트의 콜백함수가 사라지면
 * 지역 변수 startTime도 사라지기 때문에
 * endTime - startTime의 값이 NaN이 나온다.
 * 그러므로 전역 변수로 선언한다.
 */

function init() {
  console.log('Game start....');
  const containerDOM = document.querySelector('#container');

  let count = 1;
  let startTime, endTime, timer;
  let timeRecords = []; // 시간을 기록할 배열

  containerDOM.addEventListener('click', () => {
    if (containerDOM.className === 'waiting') {
      containerDOM.classList.remove('waiting');
      containerDOM.classList.add('ready');
      containerDOM.textContent = '준비......';
      timer = setTimeout(() => {
        containerDOM.classList.remove('ready');
        containerDOM.classList.add('now');
        containerDOM.textContent = '클릭!!';
        startTime = new Date();
      }, Math.floor(Math.random() * 2000) + 1000);
    } else if (containerDOM.className === 'ready') {
      containerDOM.textContent = '너무 빨리 클릭했어요 😡';
      containerDOM.classList.remove('ready');
      containerDOM.classList.add('waiting');
      clearTimeout(timer);
    } else {
      containerDOM.textContent = 'OK. One More Time 😊';
      endTime = new Date();
      timeRecords.push(endTime - startTime);
      if (count === 3) {
        // 평균 시간 출력
        const average =
          timeRecords.reduce((p, c) => p + c) / timeRecords.length;
        containerDOM.textContent = `평균 ${Number(average / 1000).toFixed(
          3,
        )}초 걸렸어요`;
        count = 0;
      }

      containerDOM.classList.remove('now');
      containerDOM.classList.add('waiting');

      count++;
    }
  });
}

// ******************************************
init();
