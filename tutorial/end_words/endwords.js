/**
 * 끝말잇기 스크립트 파일
 */

let body = document.body;
let form = document.createElement("form");
let input = document.createElement("input");
let button = document.createElement("button");
button.textContent = "확인";
let result = document.createElement("div");
let word = document.createElement("div");
word.textContent = "프리코네";

body.append(word);
body.append(form);
form.append(input);
form.append(button);
body.append(result);

// * 이벤트 등록 *
// submit 이벤트일 경우엔 추가 설정 없이 enter로 이벤트 발생이 가능하다.
form.addEventListener("submit", function(e) {
  e.preventDefault(); // submint default event 막기
  if (word.textContent[word.textContent.length - 1] === input.value[0]) {
    word.textContent = input.value;
    input.value = "";
    input.focus();
    result.textContent = "맞습니다.";
  } else {
    input.focus();
    result.textContent = "틀렸습니다.";
  }
});
