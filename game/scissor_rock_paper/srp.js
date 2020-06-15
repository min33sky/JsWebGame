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

  let cpuSelected = 'scissors';
  let userSelected = null;
  let leftCoords = IMAGE_COORDS['scissors'];
  let score = 0;

  scoreDOM.textContent = score;
  let timeOut = setInterval(rotateImage, 100); // 타이머 함수를 종료시킬 변수

  buttonDOM.forEach((button) =>
    button.addEventListener('click', (e) => {
      userSelected = e.target.id;
      clearInterval(timeOut);

      const diff = SCORE[userSelected] - SCORE[cpuSelected];

      if ([-2, 1].includes(diff)) {
        // 유저 승리
        score += 1;
        scoreDOM.textContent = score;
      } else if ([-1, 2].includes(diff)) {
        // 유저 패배
        score -= 1;
        scoreDOM.textContent = score;
      } else if (diff === 0) {
        // 비김
        scoreDOM.textContent = score;
      }

      // 1초 후 게임 재시작
      setTimeout(() => {
        timeOut = setInterval(rotateImage, 100);
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
