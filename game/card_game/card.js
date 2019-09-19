const HORIZONTAL = 4;
const VERTICAL = 3;

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

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', function(e) {
      card.classList.toggle('flipped');
    });

    document.body.appendChild(card);
  }
}

cardSetting(HORIZONTAL, VERTICAL);
