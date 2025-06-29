import type {Table} from '@tanstack/react-table';
import {Registros} from '@/types';

const ExpandHeader = ({table}: {table: Table<Registros>}) => {
  return (
    <span
      {...{
        onClick: table.getToggleAllRowsExpandedHandler()
      }}
      className="cursor-pointer scale-hover d-inline-flex font-16 align-items-center justify-content-center"
      style={{width: 'fit-content', height: 'fit-content'}}>
      {table.getIsAllRowsExpanded() ? '👇' : '👉'}
    </span>
  );
};
export default ExpandHeader;
