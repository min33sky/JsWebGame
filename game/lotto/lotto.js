/**
 * 로 또 번 호 생 성 기
 */

const lottoView = document.querySelector(".lotto");
const bonusView = document.querySelector(".bonus");

//  후보군 배열 생성 (1~45)
const substitutes = Array(45)
  .fill(0)
  .map((e, i) => i + 1);

const lottoNumbers = []; // 로또 번호를 담을 배열
while (substitutes.length > 0) {
  let idx = Math.floor(Math.random() * substitutes.length);
  lottoNumbers.push(substitutes.splice(idx, 1)[0]);
}

const lottoResult = lottoNumbers.slice(0, 6).sort((a, b) => a - b);
const bonusNumber = lottoNumbers[lottoNumbers.length - 1];

for (let i = 0; i < lottoResult.length; i++) {
  setTimeout(function() {
    let div = document.createElement("div");
    div.textContent = lottoResult[i];
    div.id = "number";

    if (lottoResult[i] <= 10) {
      div.className = "red";
    } else if (lottoResult[i] <= 20) {
      div.className = "orange";
    } else if (lottoResult[i] <= 30) {
      div.className = "yellow";
    } else if (lottoResult[i] <= 40) {
      div.className = "blue";
    } else {
      div.className = "green";
    }

    lottoView.append(div);
    // 보너스 번호 출력
    if (i == lottoResult.length - 1) {
      setTimeout(() => {
        let div = document.createElement("div");
        div.textContent = bonusNumber;
        div.id = "number";
        bonusView.append(div);
      }, 1000);
    }
  }, 1000 * i);
}

console.log(lottoNumbers);
console.log(lottoResult, "보너스 번호: " + bonusNumber);
