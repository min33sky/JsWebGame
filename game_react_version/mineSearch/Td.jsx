import React, { useContext, useCallback, memo } from 'react';
import {
  TableContext,
  CODE,
  OPEN_CELL,
  CLICK_MINE,
  QUESTION_CELL,
  FLAG_CELL,
  NORMALIZE_CELL,
} from './MineSearch';

const getTdStyle = code => {
  switch (code) {
    case CODE.NORMAL:
      return {
        background: '#888',
      };
    case CODE.OPENED:
      return {
        background: 'white',
      };
    case CODE.CLICKED_MINE:
      return {
        background: 'red',
      };
    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return {
        background: 'yellow',
      };
    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return {
        background: 'pink',
      };
    default:
      return {
        background: 'white',
      };
  }
};

const getTdText = code => {
  // console.log('getTdText');
  switch (code) {
    case CODE.NORMAL:
      return '';
    case CODE.MINE:
      return 'X';
    case CODE.CLICKED_MINE:
      return '💣';

    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return '🚩';

    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return '❓';
    default:
      return code || ''; // 0일 경우는 표시하지 않는다.
  }
};

const Td = memo(({ rowData, cellData }) => {
  const { tableData, dispatch, halted } = useContext(TableContext);

  const onClickTd = useCallback(
    e => {
      if (halted) return;

      switch (tableData[rowData][cellData]) {
        case CODE.NORMAL:
          dispatch({
            type: OPEN_CELL,
            row: rowData,
            cell: cellData,
          });
          return;
        case CODE.MINE:
          dispatch({
            type: CLICK_MINE,
            row: rowData,
            cell: cellData,
          });
          return;
        default:
          return;
      }
    },
    [tableData[rowData][cellData], halted],
  );

  const onRightClickTd = useCallback(
    e => {
      e.preventDefault();
      if (halted) return;
      switch (tableData[rowData][cellData]) {
        case CODE.NORMAL:
        case CODE.MINE:
          dispatch({
            type: FLAG_CELL,
            row: rowData,
            cell: cellData,
          });
          return;
        case CODE.FLAG:
        case CODE.FLAG_MINE:
          dispatch({
            type: QUESTION_CELL,
            row: rowData,
            cell: cellData,
          });
          return;
        case CODE.QUESTION:
        case CODE.QUESTION_MINE:
          dispatch({
            type: NORMALIZE_CELL,
            row: rowData,
            cell: cellData,
          });
          return;
        default:
          return;
      }
    },
    [tableData[rowData][cellData], halted],
  );

  // console.log('td');

  return (
    <RealTd
      onClickTd={onClickTd}
      onRightClickTd={onRightClickTd}
      data={tableData[rowData][cellData]}
    />
  );
});

/**
 * Memo를 이용해 렌더링 최적화
 * ! reactDevTool은 계속 렌더링 된다는 표시가 나오지만
 * ! 콘솔에 찍어보면 함수는 계속 호출되지만 렌더링은 한번만 되는걸 알 수 있다
 */
const RealTd = memo(({ onClickTd, onRightClickTd, data }) => {
  console.log('real td rendered');
  return (
    <td
      style={getTdStyle(data)}
      onClick={onClickTd}
      onContextMenu={onRightClickTd}
    >
      {getTdText(data)}
    </td>
  );
});

export default Td;
