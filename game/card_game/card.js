const HORIZONTAL = 4;
const VERTICAL = 3;

let blocked = true; // 카드 클릭 방지

const color = [
  'red',
  'red',
  'yellow',
  'yellow',
  'green',
  'green',
  'pink',
  'pink',
  'cyan',
  'cyan',
  'silver',
  'silver',
];

let duplicatedColor = color.slice(); // 참조 끊기
let randomCard = [];
let cardPair = []; // 비교 할 2개의 카드를 담을 배열
let checkedCard = []; // 짝이 맞는 카드들
let currentCard = null; // 같은 카드인지 체크
let startTime = null; // 시작 타이머

function shuffle() {
  while (duplicatedColor.length > 0) {
    randomCard = randomCard.concat(
      duplicatedColor.splice(
        Math.floor(Math.random() * duplicatedColor.length),
        1,
      ),
    );
  }
}

function cardSetting(hor, ver) {
  console.log('card Setting');

  for (let i = 0; i < hor * ver; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.backgroundColor = randomCard[i];

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', function(e) {
      if (
        !blocked && // 중간 클릭 방지
        !checkedCard.includes(card) && // 이미 성공한 카드 클릭 방지
        currentCard !== e.currentTarget // 같은 카드 2번 클릭 방지
      ) {
        card.classList.toggle('flipped');
        cardPair.push(card);
        if (cardPair.length === 2) {
          if (
            cardPair[0].querySelector('.card-back').style.backgroundColor ===
            cardPair[1].querySelector('.card-back').style.backgroundColor
          ) {
            checkedCard.push(cardPair[0]);
            checkedCard.push(cardPair[1]);
            cardPair = [];

            // 게임 종료 및 초기화
            if (checkedCard.length === hor * ver) {
              alert(`게임 끝...  ${(new Date() - startTime) / 1000}초`);
              // 초기화
              document.querySelector('#wrapper').innerHTML = '';
              duplicatedColor = color.slice();
              checkedCard = [];
              randomCard = [];
              cardPair = [];
              startTime = null;
              shuffle();
              cardSetting(hor, ver);
            }
          } else {
            blocked = true;
            setTimeout(() => {
              cardPair[0].classList.remove('flipped');
              cardPair[1].classList.remove('flipped');
              cardPair = [];
              blocked = false;
            }, 1000);
          }
        }
        currentCard = e.currentTarget;
      }
    });

    document.querySelector('#wrapper').appendChild(card);
  }

  document.querySelectorAll('.card').forEach((card, index) => {
    setTimeout(() => {
      card.classList.toggle('flipped');
    }, 1000 + index * 100);
  });

  document.querySelectorAll('.card').forEach((card, index) => {
    setTimeout(() => {
      card.classList.toggle('flipped');
      blocked = false;
      startTime = new Date();
    }, 3000);
  });
}

// ***** 실행 ************************************************* //

shuffle();
cardSetting(HORIZONTAL, VERTICAL);
