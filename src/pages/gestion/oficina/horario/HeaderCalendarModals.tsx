import {memo, useState} from 'react';
import {Col, Image} from 'react-bootstrap';
import {Employee, HorarioType} from '@/types';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {DateUtils, getNombreCompletoUser} from '@/utils';
import fallBackLogo from '@/assets/images/logo-fallback.png';

interface HeaderCalendarModalsProps {
  selectedUser: Employee | null;
  dateRange: [Date | null, Date | null];
  horario?: HorarioType;
}

export const HeaderCalendarModals = memo(function HeaderCalendarModals({
  selectedUser,
  dateRange,
  horario
}: HeaderCalendarModalsProps) {
  const [iconHasLoad, setIconHasLoad] = useState<boolean>(false);
  return (
    <Col xs={12}>
      <div className="d-flex">
        <div className="position-relative me-2">
          {!iconHasLoad && <SkeletonLoader customClass="position-absolute top-0 p-0 h-50" />}
          <Image
            loading="lazy"
            alt=""
            className="img-thumbnail rounded-circle object-fit-contain"
            width={175}
            height={175}
            style={{aspectRatio: '1/1'}}
            src={selectedUser?.userImage ? selectedUser?.userImage : fallBackLogo}
            onLoad={() => setIconHasLoad(true)}
          />
        </div>
        {selectedUser && (
          <p>
            Horario del usuario{' '}
            <span className="fw-bold">{getNombreCompletoUser(selectedUser ? selectedUser : ({} as Employee))}</span>,
            con un turno de entrada a las <span className="fw-bold">{horario?.horaInicio}</span>, con una jornada
            laboral de <span className="fw-bold">{horario?.horasDeTrabajo}</span> horas, un descanso de{' '}
            <span className="fw-bold">{horario?.break}</span> minutos y un rango de fechas del{' '}
            <span className="fw-bold">{`${DateUtils.formatShortDate(dateRange[0] ? dateRange[0] : new Date())} - ${DateUtils.formatShortDate(
              dateRange[1] ? dateRange[1] : new Date()
            )}`}</span>
            .
          </p>
        )}
      </div>
    </Col>
  );
});
