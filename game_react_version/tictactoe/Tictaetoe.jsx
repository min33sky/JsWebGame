import React, { useReducer, useEffect } from 'react';
import Table from './Table';

// ***************************************************************** //
// *************************** Action Type ************************* //
// ***************************************************************** //

export const SET_WINNER = 'SET_WINNER';
export const CHANGE_TURN = 'CHANGE_TURN';
export const CLICK_CELL = 'CLICK_CELL';
export const RESET_GAME = 'RESET_GAME';

// ***************************************************************** //
// **************************** Reducer **************************** //
// ***************************************************************** //

const initialState = {
  winner: '',
  turn: 'O',
  tableData: [['', '', ''], ['', '', ''], ['', '', '']],
  recentCell: [-1, -1], // 최근 클릭한 셀
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_WINNER:
      return {
        ...state,
        winner: action.winner,
      };
    case CHANGE_TURN:
      return {
        ...state,
        turn: state.turn === 'O' ? 'X' : 'O',
      };
    case CLICK_CELL:
      // 기존 배열을 얕은 복사로 가져온다. (React State의 불변성 때문에)
      const update = [...state.tableData];
      update[action.rowNumber] = [...state.tableData[action.rowNumber]];
      update[action.rowNumber][action.cellNumber] = state.turn;
      return {
        ...state,
        tableData: update,
        recentCell: [action.rowNumber, action.cellNumber],
      };
    case RESET_GAME:
      return {
        ...state,
        turn: 'O',
        tableData: [['', '', ''], ['', '', ''], ['', '', '']],
        recentCell: [-1, -1],
      };
    default:
      return state;
  }
};

// ******************************************************************* //
// **************************** Hooks ******************************** //
// ******************************************************************* //

const Tictactoe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { winner, turn, tableData, recentCell } = state;

  useEffect(() => {
    const [row, cell] = recentCell;
    if (row < 0) return; // 제일 처음 실행됐을 때는 승부 처리가 필요없다.
    let winner = false;

    /**
     * 승리 찾기
     * 1. 가로 비교
     * 2. 세로 비교
     * 3. 대각선 비교 (2곳)
     */
    // 가로줄 비교
    if (
      tableData[row][0] === turn &&
      tableData[row][1] === turn &&
      tableData[row][2] === turn
    ) {
      winner = true;
    }
    // 세로줄 비교
    if (
      tableData[0][cell] === turn &&
      tableData[1][cell] === turn &&
      tableData[2][cell] === turn
    ) {
      winner = true;
    }
    // 대각선 비교
    if (
      tableData[0][0] === turn &&
      tableData[1][1] === turn &&
      tableData[2][2] === turn
    ) {
      winner = true;
    }
    if (
      tableData[0][2] === turn &&
      tableData[1][1] === turn &&
      tableData[2][0] === turn
    ) {
      winner = true;
    }

    // ************************* Dispatch ***************************** //

    if (winner) {
      // 승리 & 재시작
      dispatch({
        type: SET_WINNER,
        winner: turn,
      });
      dispatch({
        type: RESET_GAME,
      });
    } else {
      // 더 이상 둘 곳이 없으면 무승부(초기화)
      let all = true; // true이면 무승부
      tableData.forEach(row => {
        row.forEach(cell => {
          // 빈 칸이 하나라도 있으면 false
          if (!cell) all = false;
        });
      });
      if (all) {
        dispatch({
          type: RESET_GAME,
        });
      } else {
        // 아직 둘 곳이 있고 승자가 없다면 턴 교체
        dispatch({
          type: CHANGE_TURN,
        });
      }
    }

    return () => {};
  }, [recentCell]);

  return (
    <>
      <div>😊Tic-Tac-Toe😊</div>
      <Table tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner}님의 승리✌</div>}
    </>
  );
};

export default Tictactoe;
