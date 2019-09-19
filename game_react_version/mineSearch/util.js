import { CODE } from './MineSearch';

/**
 * 지뢰 생성 함수
 * @param {Number} row 세로
 * @param {Number} cell 가로
 * @param {Number} mine 지뢰 수
 */
const plantMine = (row, cell, mine) => {
  // ***************************** //
  // ******* 지뢰 위치 생성 ******* //
  // ***************************** //
  const candidates = Array(row * cell)
    .fill(0) // undefined로 가득찬 배열을 0으로 채운다.
    .map((e, i) => i); // 각 요소를 인덱스값으로 바꾼다.
  const shuffle = []; // 지뢰를 설치 할 index들을 담을 배열
  while (candidates.length > row * cell - mine) {
    let index = candidates.splice(
      Math.floor(Math.random() * candidates.length),
      1,
    )[0];
    shuffle.push(index);
  }

  // *********************************** //
  // ** 화면과 일치시킬 데이타 배열 생성 ** //
  // *********************************** //
  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  // *********************************** //
  // ************* 지뢰 심기 ************ //
  // *********************************** //
  for (let i = 0; i < shuffle.length; i++) {
    let ver = Math.floor(shuffle[i] / cell); // 행
    let hor = shuffle[i] % cell; // 열
    data[ver][hor] = CODE.MINE;
  }

  return data;
};

export { plantMine };
