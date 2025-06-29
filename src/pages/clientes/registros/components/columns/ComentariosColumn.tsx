import {memo, useMemo} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useToggle} from '@/hooks';
import {GenericModal} from '@/components';
import DetalleModalBody from '@/pages/clientes/registros/components/modal/DetalleModalBody';
import {useAppSelector} from '@/store';
import {selectisLoadingEmployees} from '@/store/selectores';

const ComentariosColumn = memo(function ComentariosColumn({
  row,
  registerType,
  showSubRegisterIcon = false
}: {
  row: TableRow<Registros>;
  registerType: string;
  showSubRegisterIcon?: boolean;
}) {
  const thisRegister = row.original;
  const [isOpen, toggle, show] = useToggle();
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const isSubregister = useMemo(() => thisRegister.isSubRegistro, [thisRegister.isSubRegistro]);

  return (
    <div className="w-100 h-100 d-flex align-content-center align-items-center">
      {showSubRegisterIcon && row.original.isSubRegistro && (
        <i className="mdi mdi-align-horizontal-right me-1 font-10" />
      )}
      <OverlayTrigger
        overlay={
          <Tooltip id="verRegistro">
            Comentarios y anotaciones {isSubregister ? 'subregistro' : 'registro'} {thisRegister.nombre}
          </Tooltip>
        }>
        <Button
          id="verRegistro"
          variant={`outline-${isSubregister ? 'warning' : 'info'} py-0 px-1`}
          disabled={isLoadingUsers}
          onClick={show}>
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
    </div>
  );
});

export default ComentariosColumn;
