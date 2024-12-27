import {thisUsuarios} from '@/types';
import {Row as RowTable} from '@tanstack/react-table';
import {memo} from 'react';

const RenderSubComponent = ({row}: {row: RowTable<thisUsuarios>}) => {
  return (
    <pre style={{fontSize: '10px'}}>
      <code>{JSON.stringify(row.original, null, 2)}</code>
    </pre>
  );
};

const MemoizedRenderSubComponent = memo(RenderSubComponent);

export {MemoizedRenderSubComponent};
