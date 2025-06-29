import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';

const SubrowColumn = ({row}: {row: TableRow<Registros>}) => {
  return (
    row.getCanExpand() && (
      <span
        {...{
          onClick: row.getToggleExpandedHandler()
        }}
        className="d-block mb-1 cursor-pointer scale-hover font-14"
        style={{width: 'fit-content', height: 'fit-content'}}>
        {row.getIsExpanded() ? '👇' : '👉'}
      </span>
    )
  );
};
export default SubrowColumn;
