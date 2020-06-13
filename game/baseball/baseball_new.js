/**
 * 숫자야구 리뉴얼
 */

function init() {
  console.log('Game Start...');

  const Log = document.querySelector('#log');
  const Form = document.querySelector('form');
  const Input = document.querySelector('.input');

  const ANSWER = setBaseballNumber(); // 정답을 담은 배열
  let inputValue = ''; // 입력 값

  console.log('정답 : ', ANSWER);

  // TODO: 입력값과 정답을 비교해서 스트라이크 볼 판정을 내릴꺼다

  Form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = Input.value;
    inputValue = value;
    console.log(inputValue);

    // Input 초기화 및 포커스
    Input.value = '';
    Input.focus();
  });
}

/**
 * 정답을 생성하는 함수
 */
function setBaseballNumber() {
  const result = [];

  const candidadates = Array(10)
    .fill(0)
    .map((v, i) => i);

  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * candidadates.length);
    result.push(candidadates.splice(index, 1)[0]);
  }

  return result;
}

// ***********************************************

init();
