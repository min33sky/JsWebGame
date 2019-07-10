import React, { memo, useMemo, useRef, useEffect } from 'react';
import Td from './Td';

const Tr = memo(({ rowData, rowNumber, dispatch }) => {
  //  //
  /**
   * ** 어떤 부분이 변하는지 확인하는 방법 **
   * true가 리턴되면 같은 값이기 때문에 변하지 않는다는 것이고
   * false면 props가 변했기 때문에 리랜더링이 발생한다.
   */
  const ref = useRef([]);
  useEffect(() => {
    console.log(
      rowData === ref.current[0],
      rowNumber === ref.current[1],
      dispatch === ref.current[2],
    );
    ref.current = [rowData, rowNumber, dispatch];
  }, [rowData, rowNumber, dispatch]);

  /**
   * memo로도 최적화가 부족할 경우
   * useMemo를 사용한다.
   */
  return (
    <tr>
      {Array(rowData.length)
        .fill(0)
        .map((e, i) =>
          useMemo(
            () => (
              <Td
                key={'td' + i}
                rowNumber={rowNumber}
                cellNumber={i}
                cellData={rowData[i]}
                dispatch={dispatch}
              />
            ),
            [rowData[i]],
          ),
        )}
    </tr>
  );
});

export default Tr;
