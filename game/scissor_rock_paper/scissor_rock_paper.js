/**
 * 가위 바위 보
 */

var position = {
  rock: "0px",
  scissor: "-142px",
  paper: "-248px"
};

// 가위바위보 계산을 위해 규칙 설정
var rules = {
  rock: -1,
  scissor: 0,
  paper: 1
};

var left = "0px";

// *** Object.entries() : 객체를 2차원 배열로 리턴한다. *** /
console.log(Object.entries(position));

function getCurrentPosition(left) {
  return Object.entries(position).find(function(value) {
    return value[1] === left;
  })[0];
}

let switchImg;

function timer() {
  switchImg = setInterval(function() {
    if (left === position.rock) {
      left = position.scissor;
    } else if (left === position.scissor) {
      left = position.paper;
    } else {
      left = position.rock;
    }
    document.querySelector("#computer").style.background = `
      url("http://en.pimg.jp/023/182/267/1/23182267.jpg") ${left} 0`;
  }, 500);
}

timer();

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function() {
    // 클릭 시 이미지를 정지 시킨 후 1초뒤 다시 실행한다.
    clearInterval(switchImg);
    setTimeout(timer, 1000);

    // console.log("나 :" + this.id, `컴퓨터 : ${getCurrentPosition(left)}`);
    // !-- 규칙) 가위: 0, 바위: -1, 보: 1 -- //
    // 내가 선택한 값과 컴퓨터가 선택한 값을 뺐을 때
    // 0이 나오면 비김, 1이나 -2가 나오면 패배, -1이나 2가 나오면 승리가 된다.
    let me = rules[this.id];
    let cpu = rules[getCurrentPosition(left)];
    if (me - cpu === 0) {
      console.log("비 김 :o");
    } else if ([1, -2].includes(me - cpu)) {
      // *** || 문은 [].includes문으로 줄일 수 있다.
      // me - cpu === 1 || me - cpu === -2
      console.log("패 배 :<");
    } else {
      console.log("승 리 :)");
    }
  });
});
