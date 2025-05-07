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

  return (
    <div className="d-flex">
      <span className="m-0 lh-sm d-inline">
        {hora ? <span>{DateUtils.getTimeOnly(new Date(hora), false)}</span> : <span>-</span>}
      </span>
    </div>
  );
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

const FechaColumn = memo(function FechaColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
  return (
    <div className="d-flex">
      <span className="m-0 lh-sm d-inline">
        {DateUtils.formatShortDate(new Date(row.original.filterDate.split('/').reverse().join('/')))}
      </span>
    </div>
  );
});

const EntradaColumn = memo(function EntradaColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
  return <HoraColumn row={row} type="checkIn" />;
});

const SalidaColumn = memo(function SalidaColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
  return <HoraColumn row={row} type="checkOut" />;
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

  return (
    <div className="d-flex">
      <span className="m-0 lh-sm d-inline">
        {todayUserHorario ? <span>{todayUserHorario.break} Min</span> : <span>-</span>}
      </span>
    </div>
  );
});

const TotalTrabajadoColumn = memo(function BreakColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
  const todayHorasTrabajo: HorasTrabajoType | null = useMemo(() => {
    return getHorasTrabajoDelDia(row.original?.filterDate, row.original?.horasTrabajo);
  }, [row.original.filterDate, row.original.horasTrabajo]);

  return (
    <div className="d-flex">
      <span className="m-0 lh-sm d-inline">
        {todayHorasTrabajo ? (
          <span>
            {todayHorasTrabajo.horasDeTrabajo} Hs : {todayHorasTrabajo.minutosDeTrabajo} Min
          </span>
        ) : (
          <span>-</span>
        )}
      </span>
    </div>
  );
});

const TotalTrabajadoExtraColumn = memo(function BreakColumn({row}: {row: Row<EmployeeWithFilterDate>}) {
  const todayHorasTrabajo: HorasTrabajoType | null = useMemo(() => {
    return getHorasTrabajoDelDia(row.original?.filterDate, row.original?.horasTrabajo);
  }, [row.original.filterDate, row.original.horasTrabajo]);

  return (
    <div className="d-flex">
      <span className="m-0 lh-sm d-inline">
        {todayHorasTrabajo ? (
          <span>
            {todayHorasTrabajo.horasDeTrabajoExtra} Hs : {todayHorasTrabajo.minutosDeTrabajoExtra} Min
          </span>
        ) : (
          <span>-</span>
        )}
      </span>
    </div>
  );
});

const UsuariosAcciones = memo(function UsuariosAcciones({row}: {row: Row<EmployeeWithFilterDate>}) {
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
    cell: FechaColumn
  },
  {
    header: 'Entrada',
    accessorKey: 'entrada',
    cell: EntradaColumn
  },
  {
    header: 'Salida',
    accessorKey: 'salida',
    cell: SalidaColumn
  },
  {
    header: 'Break',
    accessorKey: 'break',
    cell: BreakColumn
  },
  {
    header: 'Total trabajado',
    accessorKey: 'totalTrabajado',
    cell: TotalTrabajadoColumn
  },
  {
    header: 'Total extras',
    accessorKey: 'totalExtras',
    cell: TotalTrabajadoExtraColumn
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
