/**
 * 다이아몬드 그리기
 */

let count = 4;

while (count >= -4) {
  console.log(
    ' '.repeat(Math.abs(count / 2)) + '*'.repeat(5 - Math.abs(count)),
  );

  count -= 2;
}
