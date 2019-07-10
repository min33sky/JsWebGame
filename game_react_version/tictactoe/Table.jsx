import React from 'react';
import Tr from './Tr';

const Table = ({ tableData, dispatch }) => {
  return (
    <table>
      <tbody>
        {Array(tableData.length)
          .fill(0)
          .map((e, i) => (
            <Tr
              key={'tr' + i}
              rowData={tableData[i]}
              rowNumber={i}
              dispatch={dispatch}
            />
          ))}
      </tbody>
    </table>
  );
};

export default Table;
