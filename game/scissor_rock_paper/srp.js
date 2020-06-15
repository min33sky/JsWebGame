// 가위바위보 이미지 좌표
const IMAGE_COORDS = {
  scissors: '-135px',
  rock: '0',
  paper: '-280px',
};

// 해당 모션 당 점수 표
const SCORE = {
  scissors: -1,
  rock: 0,
  paper: 1,
};

function init() {
  const computerDOM = document.querySelector('#computer');
  const buttonDOM = document.querySelectorAll('button');
  const scoreDOM = document.querySelector('#result');
  const textDOM = document.querySelector('#text');

  let clickFlag = false; // 연속 클릭을 막기 위한 플래그
  let cpuSelected = 'scissors';
  let userSelected = null;
  let leftCoords = IMAGE_COORDS['scissors'];
  let score = 0;

  scoreDOM.textContent = score;
  let timeOut = setInterval(rotateImage, 100); // 타이머 함수를 종료시킬 변수

  buttonDOM.forEach((button) =>
    button.addEventListener('click', (e) => {
      if (clickFlag) {
        console.log('1초 대기');
        button.disabled = true;
        return;
      }

      userSelected = e.target.id;
      clearInterval(timeOut);
      clickFlag = true;

      const diff = SCORE[userSelected] - SCORE[cpuSelected];
      textDOM.classList.remove('red', 'blue', 'black');

      if ([-2, 1].includes(diff)) {
        score += 1;
        textDOM.textContent = '당신의 승리!!! 😀';
        textDOM.classList.add('blue');
        scoreDOM.textContent = score;
      } else if ([-1, 2].includes(diff)) {
        score -= 1;
        textDOM.textContent = '패배입니다.. 🤬';
        textDOM.classList.add('red');
        scoreDOM.textContent = score;
      } else if (diff === 0) {
        textDOM.textContent = '무승부 😲';
        textDOM.classList.add('black');
        scoreDOM.textContent = score;
      }

      // 1초 후 게임 재시작
      setTimeout(() => {
        timeOut = setInterval(rotateImage, 100);
        clickFlag = false;
        button.disabled = false;
      }, 1000);
    }),
  );

  function rotateImage() {
    if (cpuSelected === 'scissors') {
      leftCoords = IMAGE_COORDS['rock'];
      cpuSelected = 'rock';
    } else if (cpuSelected === 'rock') {
      leftCoords = IMAGE_COORDS['paper'];
      cpuSelected = 'paper';
    } else {
      leftCoords = IMAGE_COORDS['scissors'];
      cpuSelected = 'scissors';
    }

    computerDOM.style.background = `
          url("http://en.pimg.jp/023/182/267/1/23182267.jpg") ${leftCoords} 0`;
  }
}

// ***********************************************************

init();
