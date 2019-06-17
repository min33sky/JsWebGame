/**
 * 구구단 스크립트
 */

let number1, number2;
let body = document.body;
let form = document.createElement("form");
let problem = document.createElement("div");
let input = document.createElement("input");
let button = document.createElement("button");
let result = document.createElement("div");
button.textContent = "확인";
result.textContent = "결과 출력";

body.append(problem);
body.append(form);
form.append(input);
form.append(button);
body.append(result);

randomNumber();

// * 이벤트 핸들러 *
form.addEventListener("submit", function(e) {
  e.preventDefault();
  let value = Number(input.value);
  if (value === number1 * number2) {
    input.value = "";
    input.focus();
    result.textContent = "정답!";
    randomNumber();
  } else {
    input.focus();
    result.textContent = "틀렷습니다.";
  }
});

// 랜덤 숫자 만들기
function randomNumber() {
  number1 = Math.ceil(Math.random() * 9);
  number2 = Math.ceil(Math.random() * 9);
  problem.textContent = `문제) ${number1} X ${number2} = ?`;
}
