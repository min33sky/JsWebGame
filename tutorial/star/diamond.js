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

// (전체 길이 - 별 개수) => 4 2 0 -2 -4
// 빈칸 길이 => 2 1 0 -1 -2
// 규칙 : 위의 규칙을 2로 나눈 것과 같다.
