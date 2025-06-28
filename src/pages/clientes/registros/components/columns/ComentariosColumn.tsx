import {memo} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useToggle} from '@/hooks';
import {GenericModal} from '@/components';
import DetalleModalBody from '@/pages/clientes/registros/components/modal/DetalleModalBody';

const ComentariosColumn = memo(function ComentariosColumn({
  row,
  registerType
}: {
  row: TableRow<Registros>;
  registerType: string;
}) {
  const thisRegister = row.original;
  const [isOpen, toggle, show] = useToggle();
  return (
    <>
      <OverlayTrigger
        overlay={<Tooltip id="verRegistro">Comentarios y anotaciones registro {thisRegister.nombre}</Tooltip>}>
        <Button id="verRegistro" variant="outline-info py-0 px-1" onClick={show}>
          <i className="uil-eye" />
        </Button>
      </OverlayTrigger>
      <GenericModal
        size="lg"
        show={isOpen}
        onToggle={toggle}
        headerText={`Comentarios para el registro ${thisRegister.nombre}`}
        showFooter={false}
        body={<DetalleModalBody registro={thisRegister} registerType={registerType} />}
      />
    </>
  );
});
export default ComentariosColumn;
