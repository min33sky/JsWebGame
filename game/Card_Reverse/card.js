const COLOR_EXAMPLE = [
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

function init() {
  const containerDOM = document.querySelector('#container');
  let prevCard = null;
  let cardPair = []; // 클릭 한 카드 2개를 비교하기 위해 담을 배열
  let checkedCards = []; // 결과값을 담을 배열
  let blocked = false; // 카드를 뒤집을 때 카드 클릭 방지

  let shuffledColors = shuffle(COLOR_EXAMPLE);

  generateCards(shuffledColors, containerDOM);

  // 카드 당 클릭 리스너 생성
  document.querySelectorAll('.card').forEach((card, i) => {
    card.addEventListener('click', (e) => {
      const currentCard = e.currentTarget;

      // 이미 클릭한 카드는 클릭 금지
      if (prevCard && prevCard === currentCard) {
        console.log('이미 클릭한 카드');
        return;
      }

      if (blocked) {
        console.log('이미 짞이 맞춰진 카드입니다.');
        return;
      }

      if (checkedCards.includes(currentCard)) {
        console.log('이미 짝이 맞춰진 카드 ㅎㅎㅎ');
        return;
      }

      card.classList.toggle('flipped');
      cardPair.push(currentCard);
      prevCard = currentCard;

      // 두 카드의 색깔 비교하기
      if (cardPair.length === 2) {
        // 두 카드의 색깔이 같을 띠
        if (
          cardPair[0].querySelector('.card-back').style.backgroundColor ===
          cardPair[1].querySelector('.card-back').style.backgroundColor
        ) {
          cardPair.forEach((card) => {
            checkedCards.push(card);
          });
          cardPair = [];

          if (checkedCards.length === 12) {
            setTimeout(() => {
              containerDOM.innerHTML = '';
              init();
            }, 1000);
          }
        } else {
          // 색깔이 다를 때
          blocked = true;
          setTimeout(() => {
            cardPair[0].classList.remove('flipped');
            cardPair[1].classList.remove('flipped');
            cardPair = [];
            blocked = false;
            prevCard = null;
          }, 1000);
        }
      }
    });
  });

  // 카드의 뒷면을 보여주고 3초 후에 다시 뒤집는다.
  showCardBack();
}

function generateCards(shuffledColors, containerDOM) {
  Array(12)
    .fill(0)
    .forEach((e, i) => {
      const cardDOM = document.createElement('div');
      const cardInner = document.createElement('div');
      const cardFront = document.createElement('div');
      const cardBack = document.createElement('div');

      cardDOM.classList.add('card');
      cardInner.classList.add('card-inner');
      cardFront.classList.add('card-front');
      cardBack.classList.add('card-back');
      cardFront.textContent = i + 1;
      cardBack.textContent = i + 1;
      cardBack.style.background = shuffledColors[i];

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      cardDOM.appendChild(cardInner);
      containerDOM.appendChild(cardDOM);
    });
}

function showCardBack() {
  document.querySelectorAll('.card').forEach((card, i) => {
    setTimeout(() => {
      card.classList.toggle('flipped');
    }, 1000 + i * 100);
  });

  document.querySelectorAll('.card').forEach((card, i) => {
    setTimeout(() => {
      card.classList.toggle('flipped');
    }, 3000);
  });
}

/**
 * 제공된 배열의 값을 섞어주는 함수
 */
function shuffle(originalArray) {
  const duplicated = originalArray.slice();
  const result = [];

  while (duplicated.length) {
    const index = Math.floor(Math.random() * duplicated.length);
    result.push(duplicated.splice(index, 1)[0]);
  }

  return result;
}

// *******************************************

init();
