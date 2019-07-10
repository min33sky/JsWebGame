const React = require('react');
const { useState, useRef } = React;

const texts = [
  '풍월량',
  '서새봄',
  '얍얍',
  '한동숙',
  '우정잉',
  '소풍왔니',
  '침착맨',
  '페이커',
  '공혁준',
];

const WordRelay = () => {
  const [text, setText] = useState(
    texts[Math.floor(Math.random() * texts.length)],
  );
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inputRef = useRef(null);

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (value[0] === text[text.length - 1]) {
      setText(texts[Math.floor(Math.random() * texts.length)]);
      setValue('');
      setResult('정답!😍');
    } else {
      setValue('');
      setResult('땡!😂');
    }
    inputRef.current.focus();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>문제 : {text}</div>
        <label htmlFor="label">입력: </label>
        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={handleChange}
        />
        <button>클릭</button>
        <div>{result}</div>
      </form>
    </>
  );
};

module.exports = WordRelay;
