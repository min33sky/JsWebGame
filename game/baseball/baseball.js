/**
 * 숫자야구 리뉴얼
 */

/**
 * TODO : 횟수 제한 기능 구현, 중복된 숫자 입력 막기
 */

function init() {
  const Log = document.querySelector('#log');
  const Form = document.querySelector('form');
  const Input = document.querySelector('.input');

  let ANSWER = setBaseballNumber(); // 정답을 담은 배열
  let inputValue = ''; // 입력 값

  console.log('정답 : ', ANSWER);

  Input.focus();

  Form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = Input.value;
    inputValue = value;

    if (inputValue === ANSWER.join('')) {
      const div = document.createElement('div');
      div.style.color = 'red';
      div.innerText = '홈런.....';

      Log.append(div, document.createElement('br'));
      Log.append('3초후 리셋', document.createElement('br'));
      setTimeout(() => {
        reset();
      }, 3000);
    } else {
      const inputValueArr = inputValue.split('').map((v) => Number(v));
      let strike = 0;
      let ball = 0;

      for (const [aIndex, aValue] of ANSWER.entries()) {
        for (const [inputIndex, inputValue] of inputValueArr.entries()) {
          // 값이 일치하면 최소 볼, 위치까지 일치하면 스트라이크
          if (aValue === inputValue && aIndex === inputIndex) {
            strike++;
          } else if (aValue === inputValue) {
            ball++;
          }
        }
      }

      const div = document.createElement('div');
      div.innerText = `${strike}스트라이크 ${ball}볼`;

      Log.append(div, document.createElement('br'));
    }

    // Input 초기화 및 포커스
    Input.value = '';
    Input.focus();
  });

  function reset() {
    ANSWER = setBaseballNumber();
    inputValue = '';
    Log.innerHTML = '';
    console.log(ANSWER);
  }
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
