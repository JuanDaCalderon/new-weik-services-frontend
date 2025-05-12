import {EmployeeWithFilterDate, HorarioType, HorasTrabajoType} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {GenericModal} from '@/components/Modals/GenericModal';
import {memo, useMemo, useState} from 'react';
import {Badge, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useTogglev2} from '@/hooks';
import {DateUtils, getNombreCompletoUser} from '@/utils';
import {ESTADOS, RIBBONTYPES} from '@/constants';
import fallBackLogo from '@/assets/images/logo-fallback.png';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {Asistencia} from './Asistencia';

function getHorasTrabajoDelDia(filterDate?: string, horasTrabajo: HorasTrabajoType[] = []): HorasTrabajoType | null {
  const thisFilterDate = filterDate || new Date().toLocaleDateString('es-ES');
  return horasTrabajo.find((horario) => horario.dia === thisFilterDate) || null;
}

type HoraColumnProps = {
  row: Row<EmployeeWithFilterDate>;
  type: 'checkIn' | 'checkOut';
};

const HoraColumn = memo(function HoraColumn({row, type}: HoraColumnProps) {
  const todayHorasTrabajo: HorasTrabajoType | null = useMemo(() => {
    return getHorasTrabajoDelDia(row.original?.filterDate, row.original?.horasTrabajo);
  }, [row.original.filterDate, row.original.horasTrabajo]);
  const hora = todayHorasTrabajo?.[type];
  return hora ? <span>{DateUtils.getTimeOnly(new Date(hora), false)}</span> : <span>-</span>;
});

const UsuarioColumn = memo(function UsuarioColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
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

const BreakColumn = memo(function BreakColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
  const todayUserHorario: HorarioType | null = useMemo(() => {
    const thisFilterDate = DateUtils.parseLocaleDateString(row.original.filterDate) || new Date();
    return (
      row.original.horario.find((horario) =>
        Array.isArray(horario.rangoFechas) && horario.rangoFechas.length === 2
          ? DateUtils.isDateInRange(horario.rangoFechas as [string, string], thisFilterDate)
          : false
      ) || null
    );
  }, [row.original.filterDate, row.original.horario]);
  return todayUserHorario ? <span>{todayUserHorario.break} Min</span> : <span>-</span>;
});

const DuracionDesdeFiltroColumn = memo(function DuracionDesdeFiltroColumn({
  row,
  tipo
}: {
  row: Row<EmployeeWithFilterDate>;
  tipo: 'normal' | 'extra';
}) {
  const todayHorasTrabajo: HorasTrabajoType | null = useMemo(() => {
    return getHorasTrabajoDelDia(row.original?.filterDate, row.original?.horasTrabajo);
  }, [row.original.filterDate, row.original.horasTrabajo]);
  if (!todayHorasTrabajo) return <span>-</span>;
  const horas = tipo === 'extra' ? todayHorasTrabajo.horasDeTrabajoExtra : todayHorasTrabajo.horasDeTrabajo;
  const minutos = tipo === 'extra' ? todayHorasTrabajo.minutosDeTrabajoExtra : todayHorasTrabajo.minutosDeTrabajo;
  return (
    <span>
      {horas} Hs : {minutos} Min
    </span>
  );
});

const UsuariosAcciones = memo(function UsuariosAcciones({row}: {row: Row<EmployeeWithFilterDate>}) {
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
        body={<Asistencia employee={row.original}></Asistencia>}
      />
    </>
  );
});

const EstadosColumn = memo(function EstadosColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
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
    header: 'Usuario',
    accessorKey: 'email',
    cell: UsuarioColumn
  },
  {
    header: 'Fecha',
    accessorKey: 'fecha',
    cell: ({row}) => DateUtils.formatShortDate(new Date(row.original.filterDate.split('/').reverse().join('/')))
  },
  {
    header: 'Entrada',
    accessorKey: 'entrada',
    cell: ({row}) => <HoraColumn row={row} type="checkIn" />
  },
  {
    header: 'Salida',
    accessorKey: 'salida',
    cell: ({row}) => <HoraColumn row={row} type="checkOut" />
  },
  {
    header: 'Break',
    accessorKey: 'break',
    cell: BreakColumn
  },
  {
    header: 'Total trabajado',
    accessorKey: 'horasDeTrabajo',
    cell: ({row}) => <DuracionDesdeFiltroColumn row={row} tipo="normal" />
  },
  {
    header: 'Total extras',
    accessorKey: 'horasDeTrabajoExtra',
    cell: ({row}) => <DuracionDesdeFiltroColumn row={row} tipo="extra" />
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
