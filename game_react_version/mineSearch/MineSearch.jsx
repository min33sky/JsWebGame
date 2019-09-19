import React, { useReducer, createContext, useMemo, useEffect } from 'react';
import Form from './Form';
import Table from './Table';
import { plantMine } from './util';

// ******************************************************************************* //
// ******************************** Action Type ********************************** //
// ******************************************************************************* //
export const START_GAME = 'START_GAME';
export const CLICK_MINE = 'CLICK_MINE';
export const OPEN_CELL = 'OPEN_CELL';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const UPDATE_TIMER = 'UPDATE_TIMER';

export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4, // 지뢰에 물음표
  FLAG_MINE: -5, // 지뢰에 깃발
  CLICKED_MINE: -6,
  OPENED: 0, // 0 이상이면 다 OPEN
};

// ******************************************************************************* //
// ********************************* CONTEXT API ********************************* //
// ******************************************************************************* //
export const TableContext = createContext({
  tableData: [],
  dispatch: (...args) => {},
  halted: true,
});

// ************************************************************************************ //
// ******************************* STATE & REDUCER ************************************ //
// ************************************************************************************ //

const initialState = {
  tableData: [],
  gameData: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: '',
  openedCount: 0,
  halted: true, // 게임 중지
};

const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        tableData: plantMine(action.row, action.cell, action.mine),
        gameData: {
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        timer: 0,
        halted: false,
        result: '',
      };
    case OPEN_CELL: {
      const tableData = [...state.tableData];
      const checked = []; //  이미 연 칸 캐싱하기 위한 배열 (연 셀의 개수 파악을 위해서)
      let openedCount = 0; // 연 셀의 개수
      let halted = false;
      let result = '';

      /*
       * 주위의 셀들도 함께 열어야 하기때문에
       * 불변성을 지키기 위해서 각 행을 다 복사한다.
       */
      tableData.forEach((row, i) => {
        tableData[i] = [...row];
      });

      /**
       * 선택한 셀 주위를 검색하는 함수
       * @param {Number} row 행
       * @param {Number} cell 칸
       */
      const checkAround = (row, cell) => {
        // 범위 벗어나는 칸은 열지 않기
        if (
          row < 0 ||
          row >= tableData.length ||
          cell < 0 ||
          cell >= tableData[0].length
        ) {
          return;
        }
        // 닫힌 칸만 열기 (초기 상태인 셀)
        if (
          [
            CODE.FLAG_MINE,
            CODE.QUESTION_MINE,
            CODE.OPENED,
            CODE.FLAG,
            CODE.QUESTION,
          ].includes(tableData[row][cell])
        ) {
          return;
        }

        /**
         * 이미 연 셀은 개수에 포함시키지 않는다.
         */
        if (checked.includes(row + '/' + cell)) {
          return;
        } else {
          checked.push(row + '/' + cell);
        }

        /**
         * 현재 셀 주위의 지뢰 개수 표시하기
         */
        let around = [];
        if (tableData[row - 1]) {
          around = around.concat([
            tableData[row - 1][cell - 1],
            tableData[row - 1][cell],
            tableData[row - 1][cell + 1],
          ]);
        }
        around = around.concat([
          tableData[row][cell - 1],
          tableData[row][cell + 1],
        ]);
        if (tableData[row + 1]) {
          around = around.concat([
            tableData[row + 1][cell - 1],
            tableData[row + 1][cell],
            tableData[row + 1][cell + 1],
          ]);
        }

        // 지뢰와 관련된 셀이면 개수에 포함시킨다.
        const count = around.filter(v =>
          [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE].includes(v),
        ).length;

        /**
         * 현재 셀 주위에 지뢰가 없다면
         * 주위 셀도 함께 열어준다.
         * - 2차원 배열의 경우 행이 인덱스 범위를 벗어나면
         * - 에러가 발생하지만 열은 인덱스 범위를 벗어나면
         * - undefined를 리턴한다.
         */
        if (count === 0) {
          // 행의 범위만 신경써주면 된다.
          if (row > -1) {
            const near = [];
            // 0행은 제외
            if (row - 1 > -1) {
              near.push([row - 1, cell - 1]);
              near.push([row - 1, cell]);
              near.push([row - 1, cell + 1]);
            }
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            // 최대 범위를 벗어나도 제외
            if (row + 1 < tableData.length) {
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }
            near.forEach(n => {
              // 이미 열려 있는 셀은 다시 주위 검색을 하지 않는다.
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkAround(n[0], n[1]);
              }
            });
          }
        }

        /**
         * 닫힌 셀을 열 때만 개수를 증가시킨다.
         */
        if (tableData[row][cell] === CODE.NORMAL) {
          openedCount++;
        }
        tableData[row][cell] = count; // 주위 지뢰 개수 표시
      };

      // 주위 지뢰 검색
      checkAround(action.row, action.cell);

      // 지뢰를 제외한 나머지 셀을 다 열면 승리
      if (
        state.gameData.row * state.gameData.cell - state.gameData.mine ===
        state.openedCount + openedCount
      ) {
        halted = true;
        result = `${state.timer}초 만에 승리하셨습니다. 😊`;
      }

      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result,
      };
    }
    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData,
        halted: true,
      };
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.MINE) {
        tableData[action.row][action.cell] = CODE.FLAG_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.FLAG;
      }
      return {
        ...state,
        tableData,
      };
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData,
      };
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
        tableData[action.row][action.cell] = CODE.MINE;
      } else {
        tableData[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData,
      };
    }

    case UPDATE_TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
      };
    }

    default:
      return state;
  }
};

// *************************************************************************** //
// ******************************** COMPONENT ******************************** //
// *************************************************************************** //

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, timer, result, halted } = state;

  /**
   * ContextApi 성능 최적화를 위해 캐싱
   * - dispatch는 절대 바뀌지 않으므로 tableData, halted가 바뀔 때만 갱신
   */
  const value = useMemo(() => ({ tableData, dispatch, halted }), [
    tableData,
    halted,
  ]);

  useEffect(() => {
    let timer;
    // 처음 시작할 때는 타이머를 동작하지 않는다.
    if (halted === false) {
      // 1초마다 시간 변경 디스패치 호출
      timer = setInterval(() => {
        dispatch({
          type: UPDATE_TIMER,
        });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [halted]);

  return (
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}초</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
  );
};

export default MineSearch;
