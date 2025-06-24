import {memo} from 'react';
import type {Row} from '@tanstack/react-table';
import {Button} from 'react-bootstrap';
import {Registros} from '@/types';

const LinkColumn = memo(function LinkColumn({row}: {row: Row<Registros>}) {
  return (
    <Button as="a" href={row.original.link} target="_blank" variant="outline-light py-0 px-1">
      <i className="uil-external-link-alt" />
    </Button>
  );
});
export default LinkColumn;
