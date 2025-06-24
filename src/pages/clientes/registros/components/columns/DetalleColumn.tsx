import {memo} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useToggle} from '@/hooks';
import {GenericModal} from '@/components';
import DetalleModalBody from '@/pages/clientes/registros/components/modal/DetalleModalBody';

const DetalleColumn = memo(function DetalleColumn({row}: {row: TableRow<Registros>}) {
  const thisRegister = row.original;
  const [isOpen, toggle, show] = useToggle();
  return (
    <>
      <OverlayTrigger overlay={<Tooltip id="verRegistro">Ver registro {thisRegister.nombre}</Tooltip>}>
        <Button id="verRegistro" variant="outline-info py-0 px-1" onClick={show}>
          <i className="uil-eye" />
        </Button>
      </OverlayTrigger>
      <GenericModal
        size="lg"
        show={isOpen}
        onToggle={toggle}
        headerText={`Registro ${thisRegister.nombre}`}
        showFooter={false}
        body={<DetalleModalBody registro={thisRegister} />}
      />
    </>
  );
});
export default DetalleColumn;
