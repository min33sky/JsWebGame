/**
 * 숫자 4개를 중복없이 랜덤으로 뽑아주는 함수
 */
function getNumbers() {
  const candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array = [];

  for (let i = 0; i < 4; i++) {
    let randomIdx = Math.floor(Math.random() * candidate.length);
    array.push(candidate.splice(randomIdx, 1)[0]);
  }

  return array;
}

module.exports = {
  getNumbers,
};
