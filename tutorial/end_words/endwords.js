/**
 * 끝말잇기 스크립트 파일
 */

const words = [
  '네이버',
  '카카오',
  '아프리카',
  '트위치',
  '유튜브',
  '구글',
  '아마존',
  '페이스북',
  '애플',
  '삼성',
];

function getRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

function init() {
  const form = document.querySelector('form');
  const button = document.querySelector('form button');
  const input = document.querySelector('form input');
  const result = document.querySelector('#result');
  const keyword = document.querySelector('#word');
  const modal = document.querySelector('.modal');
  const modalButton = document.querySelector('.modal button');
  const modalOverlay = document.querySelector('.modal-overlay');

  const randomWord = getRandomWord();

  const dictionary = [];

  keyword.textContent = randomWord;

  // submit 이벤트일 경우엔 추가 설정 없이 enter로 이벤트 발생이 가능하다.
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (input.value.trim() === '') return;

    if (result.className === 'failure') {
      result.classList.remove('failure');
    } else {
      result.classList.remove('success');
    }

    // 중복 확인
    if (dictionary.includes(input.value)) {
      showModal();
      result.textContent = '';
    } else if (
      word.textContent[word.textContent.length - 1] === input.value[0]
    ) {
      word.textContent = input.value;
      result.classList.add('success');
      result.textContent = '맞습니다.';
      dictionary.push(input.value);
    } else {
      result.classList.add('failure');
      result.textContent = '틀렸습니다.';
    }
    input.value = '';
    input.focus();
  });

  // 모달 관리
  modalButton.addEventListener('click', () => {
    closeModal();
  });

  modalOverlay.addEventListener('click', () => {
    closeModal();
  });

  function showModal() {
    modal.classList.remove('hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
  }
}

//  **** Start ***** //

init();
