import React, { useContext, memo } from 'react';
import Td from './Td';
import { TableContext } from './MineSearch';

const Tr = memo(({ rowData }) => {
  const { tableData } = useContext(TableContext);
  return (
    <tr>
      {tableData[0] &&
        Array(tableData[0].length)
          .fill(0)
          .map((e, i) => <Td key={'td' + i} rowData={rowData} cellData={i} />)}
    </tr>
  );
});

export default Tr;
