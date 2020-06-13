/**
 * 별 그리기 예제 (오른쪽으로 기울인 삼각형)
 */

let count = 4;

while (count >= -4) {
  console.log('*'.repeat(5 - Math.abs(count)));
  count -= 2;
}

// *********************************************************

/*
  ! 풀이
  1 ,3 , 5, 3, 1 순서로 별이 찍힌다.
  행의 길이는 5. 행에서 별의 개수를 빼면 4, 2, 0, 2, 4가 된다.
  -2씩 줄다가 0부터는 2씩 늘어나는 규칙이 나온다.
  이 것은 -2씩 계속 줄어가는 것의 절대값들과 같은 결과다.
 */