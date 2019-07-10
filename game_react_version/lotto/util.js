/**
 * 로또 번호 추첨기 함수
 */
function getWinNumbers() {
  console.log('getWinNumbers');
  const MAX_LOTTO_NUMBER = 45;
  const candidate = new Array(MAX_LOTTO_NUMBER).fill(0).map((v, i) => i + 1);
  const shuffle = []; // 기존 배열을 섞은 배열
  while (candidate.length > 0) {
    shuffle.push(
      candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0],
    );
  }

  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((a, b) => a - b);
  return [...winNumbers, bonusNumber];
}

module.exports = {
  getWinNumbers,
};
