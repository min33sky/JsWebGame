/**
 * 숫 자 야 구
 */
const form = document.querySelector('.form');
const result = document.querySelector('.result');
const input = document.querySelector('.input');
const button = document.querySelector('.btn');
const MAX = 10; // 10번의 기회

let randomBaseballNumber; // 랜덤 숫자를 담을 배열
let count = 0;
getRandomNumber();

form.addEventListener('submit', function(e) {
  e.preventDefault();
  let data = Number(input.value);

  if (data === Number(randomBaseballNumber.join(''))) {
    console.log('정답');
    input.value = '';
    input.focus();
    getRandomNumber();
    count = 0;
    result.textContent = '정 답 :) 한번 더 ??';
  } else {
    // 정답이 아닐 경우
    let ball = 0;
    let strike = 0;
    for (let i = 0; i < randomBaseballNumber.length; i++) {
      if (Number(input.value[i]) === randomBaseballNumber[i]) {
        strike++;
      } else if (randomBaseballNumber.indexOf(Number(input.value[i])) > -1) {
        ball++;
      }
    }
    count++;
    if (count === MAX) {
      result.textContent = `탈락! (정답: ${randomBaseballNumber})`;
      count = 0;
    } else {
      result.textContent = `${strike}스트라이크 ${ball}볼 - (${MAX -
        count}번의 기회가 남았습니다.)`;
    }
  }
});

/**
 * 랜덤 숫자 생성
 */
function getRandomNumber() {
  let substitute = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let result = [];
  for (let i = 0; i < 4; i++) {
    let idx = Math.floor(Math.random() * substitute.length);
    let number = substitute.splice(idx, 1)[0];
    result.push(number);
  }
  console.log('정답: ', result);
  randomBaseballNumber = result;
}
