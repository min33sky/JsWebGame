function init() {
  console.log('Calculator Start...');

  const input = document.querySelector('input');
  const buttons = document.querySelectorAll('button');

  let prevValue = '';
  let currentValue = '';
  let operator = '';
  let result = '0';

  input.value = result;

  // 인풋 키보드 입력

  // 버튼 클릭 이벤트 등록
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const text = e.target.innerText;

      if (text === 'C') {
        reset();
      } else if (text === '=') {
        // 결과를 출력
        result = calc(operator, prevValue, currentValue);
        prevValue = result;
        currentValue = '';
        operator = '';
        input.value = result;
      } else if (!['+', '-', '/', '*'].includes(text)) {
        if (!operator) {
          prevValue += text;
          input.value = prevValue;
        } else {
          currentValue += text;
          console.log(currentValue);
          input.value += text;
        }
      } else {
        // 연산자
        operator = text;
        input.value += operator;
      }
    });
  });

  function reset() {
    // 0으로 초기화
    prevValue = '';
    currentValue = '';
    operator = '';
    result = '0';
    input.value = result;
  }
}

/**
 *
 * @param {*} operator 연산자
 * @param {*} prevValue 이전 값
 * @param {*} currentValue 현재 값
 */
function calc(operator, prevValue, currentValue) {
  let result = 0;
  let pv = Number(prevValue);
  let cv = Number(currentValue);

  switch (operator) {
    case '+':
      result = pv + cv;
      break;
    case '-':
      result = pv - cv;
      break;
    case '*':
      result = pv * cv;
      break;
    case '/':
      result = pv / cv;
      break;
  }

  console.log(result);

  return result;
}

init();
