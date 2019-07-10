import React, { memo } from 'react';

const Tries = memo(({ tries }) => {
  return (
    <ul>
      {tries.map((v, i) => (
        <li key={v.try + i}>
          {v.try} : {v.result}
        </li>
      ))}
    </ul>
  );
});

export default Tries;
