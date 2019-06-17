/**
 * for문으로 별 찍기
 *
 */

for (var star = -8; star < 9; star += 2) {
  console.log(" ".repeat(Math.abs(star) / 2) + "*".repeat(9 - Math.abs(star)));
}
