/**
 * 반응속도 테스트
 */

const container = document.querySelector('#container');
let startTime, endTime, timer;
let records = [];
let gameCount = 0;

container.addEventListener('click', () => {
  /**
   * ! 비동기 함수는 호출스택(call Stack)에 들어갔다 바로 나간다.
   * callStack에서 click 이벤트의 콜백함수가 사라지면
   * 지역 변수 startTime도 사라지기 때문에
   * endTime - startTime의 값이 NaN이 나온다.
   * 그러므로 전역 변수로 선언한다.
   */
  if (container.classList.contains('waiting')) {
    container.classList.remove('waiting');
    container.classList.add('ready');
    container.textContent = '빨간색일 될 때 클릭하세요';
    timer = setTimeout(() => {
      startTime = new Date();
      container.click();
    }, Math.floor(Math.random() * 1000) + 2000);
  } else if (container.classList.contains('ready')) {
    if (!startTime) {
      container.textContent = '너무 빨라요';
      container.classList.remove('ready');
      container.classList.add('waiting');
      clearTimeout(timer);
    } else {
      container.classList.remove('ready');
      container.classList.add('now');
      container.textContent = '클 릭💨';
    }
  } else if (container.classList.contains('now')) {
    endTime = new Date();
    records.push(endTime - startTime);
    container.classList.remove('now');
    container.classList.add('waiting');
    container.textContent = '좋아! 한번 더✨ ';
    gameCount++;
    startTime = 0;
  }
  if (gameCount === 3) {
    const result = records.reduce((p, acc) => acc + p, 0) / records.length;
    container.textContent = `평균 반응속도 : ${result}ms`;
    gameCount = 0;
  }
});
