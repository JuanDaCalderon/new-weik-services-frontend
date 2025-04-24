import {Employee} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {GenericModal} from '@/components/Modals/GenericModal';
import {memo, useMemo, useState} from 'react';
import {Badge, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useTogglev2} from '@/hooks';
import {getNombreCompletoUser} from '@/utils';
import {ESTADOS, RIBBONTYPES} from '@/constants';
import fallBackLogo from '@/assets/images/logo-fallback.png';
import {SkeletonLoader} from '@/components/SkeletonLoader';

const UsuarioColumn = memo(function UsuarioColumn({row}: {row: Row<Employee>}) {
  const [iconHasLoad, setIconHasLoad] = useState<boolean>(false);
  return (
    <div className="d-flex align-items-center no-user-text-selectable table-user">
      <div className="position-relative">
        {!iconHasLoad && <SkeletonLoader customClass="position-absolute p-0" />}
        <img
          src={row.original.userImage && row.original.userImage !== '' ? row.original.userImage : fallBackLogo}
          alt={row.original.userImage && row.original.userImage !== '' ? row.original.userImage : 'user'}
          loading="lazy"
          className="me-1 rounded-circle object-fit-contain"
          onLoad={() => setIconHasLoad(true)}
        />
      </div>
      <div className="ms-1 d-flex flex-column">
        <span className="m-0 lh-sm fw-bold text-uppercase text-dark text-opacity-75 d-inline">
          {getNombreCompletoUser(row.original)}
        </span>
        <span className="m-0 lh-sm d-inline">{row.original.email}</span>
      </div>
    </div>
  );
});

const UsuariosAcciones = memo(function UsuariosAcciones({row}: {row: Row<Employee>}) {
  const {show: showReporte, isOpen: isOpenReporte, toggle: toggleReporte} = useTogglev2();
  const {show: showFeedback, isOpen: isOpenFeedback, toggle: toggleFeedback} = useTogglev2();

  return (
    <>
      <div className="d-flex gap-1">
        <OverlayTrigger overlay={<Tooltip id="activarUser">Asistencia</Tooltip>}>
          <Button id="activarUser" variant="outline-info py-0 px-1" onClick={showReporte}>
            <i className="uil-document-layout-left" />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip id="calificar">retroalimentación</Tooltip>}>
          <Button id="calificar" variant="outline-warning py-0 px-1" onClick={showFeedback}>
            <i className="uil-star"></i>
          </Button>
        </OverlayTrigger>
      </div>
      <GenericModal
        show={isOpenReporte}
        onToggle={toggleReporte}
        size="xl"
        variant="primary"
        headerText={`Reporte de asistencia de ${row.original.email}`}
        showSendButton={false}
        secondaryText="Cancelar"
        body={<></>}
      />
      <GenericModal
        show={isOpenFeedback}
        onToggle={toggleFeedback}
        size="xl"
        headerText={`Evaluar a ${row.original.email}`}
        submitText="Enviar"
        secondaryText="Cancelar"
        body={<></>}
      />
    </>
  );
});

const EstadosColumn = memo(function EstadosColumn({row}: {row: Row<Employee>}) {
  const ribbonType = useMemo(() => {
    const estado = row.original.estado;
    const estadoMap: Record<string, RIBBONTYPES> = {
      [ESTADOS.online]: RIBBONTYPES.success,
      [ESTADOS.offline]: RIBBONTYPES.danger,
      [ESTADOS.inactivo]: RIBBONTYPES.warning
    };
    return estadoMap[estado] || RIBBONTYPES.info;
  }, [row.original.estado]);
  return (
    <Badge bg="" pill className={`no-user-text-selectable me-1 badge-outline-${ribbonType} font-14`}>
      {row.original.estado}
    </Badge>
  );
});

const columns: ColumnDef<Employee>[] = [
  {
    header: 'Usuario',
    accessorKey: 'email',
    cell: UsuarioColumn
  },
  {
    header: 'Estado',
    accessorKey: 'estado',
    cell: EstadosColumn
  },
  {
    header: 'Acciones',
    accessorKey: 'acciones',
    cell: UsuariosAcciones
  }
];

export {columns};
