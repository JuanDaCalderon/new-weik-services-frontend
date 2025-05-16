import {EmployeeWithFilterDate} from '@/types';
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

const _UsuarioColumn = memo(function UsuarioColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
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

const _UsuariosAcciones = memo(function UsuariosAcciones({row}: {row: Row<EmployeeWithFilterDate>}) {
  const {show: showReporte, isOpen: isOpenReporte, toggle: toggleReporte} = useTogglev2();
  return (
    <>
      <OverlayTrigger overlay={<Tooltip id="activarUser">Asistencia</Tooltip>}>
        <Button id="activarUser" variant="outline-info py-0 px-1" onClick={showReporte}>
          <i className="uil-document-layout-left" />
        </Button>
      </OverlayTrigger>
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
    </>
  );
});

const _EstadosColumn = memo(function EstadosColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
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

const columns: ColumnDef<EmployeeWithFilterDate>[] = [
  {
    header: 'Titulo',
    accessorKey: 'titulo'
  },
  {
    header: 'Fechas',
    accessorKey: 'rangoFechas'
  },
  {
    header: 'Evaluador',
    accessorKey: 'evaluator'
  },
  {
    header: 'Estado',
    accessorKey: 'status'
  },
  {
    header: 'Acciones',
    accessorKey: 'acciones'
  }
];

export {columns};
