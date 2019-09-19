import React, { useContext, memo } from 'react';
import Tr from './Tr';
import { TableContext } from './MineSearch';

const Table = memo(() => {
  const { tableData } = useContext(TableContext);
  return (
    <table>
      <tbody>
        {Array(tableData.length)
          .fill(0)
          .map((e, i) => (
            <Tr key={'tr' + i} rowData={i} />
          ))}
      </tbody>
    </table>
  );
});

export default Table;
