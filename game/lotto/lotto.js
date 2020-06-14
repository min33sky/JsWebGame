function init() {
  const containerDOM = document.querySelector('#container');
  const lottoDOM = document.querySelector('.lotto');
  const bonusDOM = document.querySelector('.bonus');

  const LOTTO = getLottoNumber(); // 로또번호 배열과 보너스 번호를 담은 객체

  const interval = setInterval(() => {
    const divDOM = document.createElement('div');
    divDOM.classList.add('number');

    if (LOTTO.lottoNumber.length === 0) {
      clearInterval(interval);
      divDOM.innerText = LOTTO.bonus;
      colorize(divDOM, LOTTO.bonus);
      bonusDOM.appendChild(divDOM);
    } else {
      const number = LOTTO.lottoNumber.splice(0, 1)[0];
      divDOM.innerText = number;
      colorize(divDOM, number);
      lottoDOM.appendChild(divDOM);
    }
  }, 1000);
}

/**
 * 로또번호 생성 함수
 */
function getLottoNumber() {
  const lotto = {};

  const candidates = Array(45)
    .fill(0)
    .map((v, i) => i + 1);

  const lottoNumber = [];

  // candidates 배열의 값을 섞은 후 앞에서 6개는 로또번호 제일 뒷 번호는 보너스 번호로 설정
  while (candidates.length) {
    const index = Math.floor(Math.random() * candidates.length);
    lottoNumber.push(candidates.splice(index, 1)[0]);
  }

  lotto.lottoNumber = lottoNumber.slice(0, 6).sort((p, c) => p - c);
  lotto.bonus = lottoNumber[lottoNumber.length - 1];

  return lotto;
}

/**
 * 해당 DOM에 색깔을 입히는 함수
 * @param {*} dom
 * @param {*} number
 */
function colorize(dom, number) {
  if (number < 10) {
    dom.classList.add('red');
  } else if (number < 20) {
    dom.classList.add('green');
  } else if (number < 30) {
    dom.classList.add('yellow');
  } else if (number < 40) {
    dom.classList.add('orange');
  } else if (number <= 45) {
    dom.classList.add('blue');
  }
}

// ***********************************

init();
