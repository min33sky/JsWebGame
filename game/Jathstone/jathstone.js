const rival = {
  hero: document.querySelector('#rival-hero'),
  deck: document.querySelector('#rival-deck'),
  field: document.querySelector('#rival-cards'),
  cost: document.querySelector('#rival-cost'),
  deckData: [],
  heroData: {},
  fieldData: [],
  selected: null,
  selectedData: null,
};

const me = {
  hero: document.querySelector('#my-hero'),
  deck: document.querySelector('#my-deck'),
  field: document.querySelector('#my-cards'),
  cost: document.querySelector('#my-cost'),
  deckData: [],
  heroData: {},
  fieldData: [],
  selected: null,
  selectedData: null,
};

let turnButton = document.querySelector('#turn-btn');
let turn = true; // true 내 턴, false 상대방 턴

// 덱에서 필드로 카드 이동
function fieldFromDeck(data, turn) {
  let obj = turn ? me : rival;
  let currentCost = Number(obj.cost.textContent);
  // 코스트 넘기면 카드 선택 불가
  if (currentCost < data.cost) {
    return 'end';
  }
  let index = obj.deckData.indexOf(data);
  obj.deckData.splice(index, 1);
  obj.fieldData.push(data);
  reDrawField(obj);
  reDrawDeck(obj);
  data.field = true; // 카드가 필드로 올라갔다.
  obj.cost.textContent = currentCost - data.cost;
}

function reDrawField(obj) {
  obj.field.innerHTML = '';
  obj.fieldData.forEach(data => connectDom(data, obj.field));
}

function reDrawDeck(obj) {
  obj.deck.innerHTML = '';
  obj.deckData.forEach(data => connectDom(data, obj.deck));
}

function reDrawHero(obj) {
  obj.hero.innerHTML = '';
  connectDom(obj.heroData, obj.hero, true);
}

// 화면 다시 그리기
function reDrawView(turn) {
  const obj = turn ? me : rival;
  reDrawField(obj);
  reDrawDeck(obj);
  reDrawHero(obj);
}

function actTurnAction(card, data, turn) {
  // 턴이 끝난 카드면 아무 일도 일어나지 않음
  let ally = turn ? me : rival;
  let enemy = turn ? rival : me;
  if (card.classList.contains('card-turnover')) {
    return;
  }

  // 적군 카드면서 아군 카드가 선택되어 있고, 또 그게 턴이 끝난 카드가 아니면 공격
  let enemyCard = turn ? !data.mine : data.mine;
  if (enemyCard && ally.selected) {
    data.hp = data.hp - ally.selectedData.att;
    if (data.hp <= 0) {
      let index = enemy.fieldData.indexOf(data);
      if (index > -1) {
        enemy.fieldData.splice(index, 1);
      } else {
        alert('승리하셨습니다.');
        initialSetting();
      }
    }

    reDrawView(!turn);
    ally.selected.classList.remove('card-selected');
    ally.selected.classList.add('card-turnover');
    ally.selected = null;
    ally.selectedData = null;
    return;
  } else if (enemyCard) {
    return;
  }

  if (data.field) {
    // 필드 카드 클릭
    Array.from(document.querySelectorAll('.card')).forEach(card =>
      card.classList.remove('.card-selected'),
    );
    card.classList.add('card-selected');
    ally.selected = card;
    ally.selectedData = data;
  } else {
    // 덱 카드 클릭
    if (fieldFromDeck(data, turn) !== 'end') {
      turn ? createMyDeck(1) : createRivalDeck(1);
    }
  }
}

// DOM에 카드 그려주는 함수
function connectDom(data, dom, hero) {
  let card = document.querySelector('.card-hidden .card').cloneNode(true); // DOM 복사
  console.log('data :', data);
  card.querySelector('.card-cost').textContent = data.cost;
  card.querySelector('.card-att').textContent = data.att;
  card.querySelector('.card-hp').textContent = data.hp;

  if (hero) {
    card.querySelector('.card-cost').style.display = 'none';
    let name = document.createElement('div');
    name.textContent = '영웅';
    card.appendChild(name);
  }

  card.addEventListener('click', () => {
    actTurnAction(card, data, turn);
  });

  dom.appendChild(card);
}

function createRivalDeck(number) {
  for (let i = 0; i < number; i++) {
    rival.deckData.push(cardFactory());
  }
  reDrawDeck(rival);
}

function createMyDeck(number) {
  for (let i = 0; i < number; i++) {
    me.deckData.push(cardFactory(false, true));
  }
  reDrawDeck(me);
}

function createMyHero() {
  me.heroData = cardFactory(true, true);
  connectDom(me.heroData, me.hero, true);
}

function createRiverHero() {
  rival.heroData = cardFactory(true);
  connectDom(rival.heroData, rival.hero, true);
}

// 생성자 함수
function Card(hero, myCard) {
  if (hero) {
    this.att = Math.ceil(Math.random() * 2);
    this.hp = Math.ceil(Math.random() * 5) + 25;
    this.hero = true;
    this.field = true;
  } else {
    this.att = Math.ceil(Math.random() * 5);
    this.hp = Math.ceil(Math.random() * 5);
    this.cost = Math.ceil((this.att + this.hp) / 2);
  }
  if (myCard) {
    this.mine = true;
  }
}

// 팩토리 패턴
function cardFactory(hero, myCard) {
  return new Card(hero, myCard);
}

turnButton.addEventListener('click', () => {
  let obj = turn ? me : rival;
  document.querySelector('#my').classList.toggle('turn');
  document.querySelector('#rival').classList.toggle('turn');
  reDrawField(obj);
  reDrawHero(obj);
  turn = !turn;
  turn ? (me.cost.textContent = 10) : (rival.cost.textContent = 10);
});

// 진입점
function initialSetting() {
  [me, rival].forEach(item => {
    item.deckData = [];
    item.heroData = [];
    item.fieldData = [];
    item.selectedData = null;
    item.selected = null;
  });
  createMyDeck(5);
  createRivalDeck(5);
  createMyHero();
  createRiverHero();
  reDrawView(true);
  reDrawView(false);
}

// ***** 시작 ********************************************************* //

initialSetting();
