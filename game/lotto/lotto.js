function init() {
  console.log('Game Start...');
  const containerDOM = document.querySelector('#container');
  const lottoDOM = document.querySelector('.lotto');
  const bonusDOM = document.querySelector('.bonus');
  const COLORS = ['green', 'yellow', 'blue', 'red', 'orange', 'violet'];

  const LOTTO = getLottoNumber(); // 로또번호 배열과 보너스 번호를 담은 객체

  console.log(LOTTO);

  const interval = setInterval(() => {
    const divDOM = document.createElement('div');
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    divDOM.classList.add('number', color);

    if (LOTTO.lottoNumber.length === 0) {
      clearInterval(interval);
      divDOM.innerText = LOTTO.bonus;
      bonusDOM.appendChild(divDOM);
    } else {
      const number = LOTTO.lottoNumber.splice(0, 1)[0];
      divDOM.innerText = number;
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

  lotto.lottoNumber = lottoNumber.slice(0, 6);
  lotto.bonus = lottoNumber[lottoNumber.length - 1];

  return lotto;
}

// ***********************************

init();
