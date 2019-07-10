import React, { useCallback, memo } from 'react';
import { CLICK_CELL } from './Tictaetoe';

const Td = memo(({ rowNumber, cellNumber, dispatch, cellData }) => {
  const handleClick = useCallback(() => {
    // 기존에 클릭한 곳은 클릭 금지
    if (cellData) return;

    dispatch({
      type: CLICK_CELL,
      rowNumber,
      cellNumber,
    });
  }, [cellData]); // cellData가 바뀔 때 마다 함수 안의 변수 cellData 업데이트

  return <td onClick={handleClick}>{cellData}</td>;
});

export default Td;
