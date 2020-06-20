console.log('테스트 입니다.');

const button = document.querySelector('button');

const select = document.querySelector('#difficulty_select');

button.addEventListener('click', () => {
  const value = document.querySelector(`input[name='difficulty']:checked`)
    .value;
  console.log(value);
  const value2 = select.options[select.selectedIndex].value;
  console.log(value2);
});
