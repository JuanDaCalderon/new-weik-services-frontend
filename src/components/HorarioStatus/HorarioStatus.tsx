import {memo, useCallback, useMemo} from 'react';
import {Card, Row, Col, Button, Alert} from 'react-bootstrap';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {useCheckIn, useCheckOut, useSetEstadoUser} from '@/endpoints';
import {calcularHorasTrabajo, DateUtils} from '@/utils';
import {Toaster} from 'react-hot-toast';
import {TOAST_DURATION} from '@/constants';

const HorarioStatus = memo(function HorarioStatus() {
  const todayDate = new Date().toLocaleDateString();
  const user = useAppSelector(selectUser);
  const {checkIn, isSavingCheckIn} = useCheckIn();
  const {checkOut, isSavingCheckOut} = useCheckOut();
  const {setOfflineUser} = useSetEstadoUser();

  const clockIn = useCallback(async () => {
    await checkIn();
  }, [checkIn]);

  const clockOut = useCallback(async () => {
    await checkOut();
    await setOfflineUser(user.id);
  }, [checkOut, setOfflineUser, user.id]);

  const currentCheckIn: string = useMemo(() => {
    if (user.horasTrabajo.length <= 0) return 'No tienes horas de trabajo registradas';
    const horasTrabajo = user.horasTrabajo.find((h) => h.dia === todayDate);
    if (!horasTrabajo) return 'No ha hecho check-in';
    const checkInDate = new Date(horasTrabajo.checkIn);
    return `${DateUtils.formatShortDate(checkInDate, false)}, ${DateUtils.getTimeOnly(checkInDate, false)}`;
  }, [todayDate, user.horasTrabajo]);

  const currentCheckOut: string = useMemo(() => {
    if (user.horasTrabajo.length <= 0) return 'No tienes horas de trabajo registradas';
    const horasTrabajo = user.horasTrabajo.find((h) => h.dia === todayDate);
    if (!horasTrabajo) return 'No ha hecho check-in';
    if (horasTrabajo.checkOut === null) return 'No ha hecho check-out';
    const checkOutDate = new Date(horasTrabajo.checkOut);
    return `${DateUtils.formatShortDate(checkOutDate, false)}, ${DateUtils.getTimeOnly(checkOutDate, false)}`;
  }, [todayDate, user.horasTrabajo]);

  const currentHorasTrabajadas: string = useMemo(() => {
    if (user.horasTrabajo.length <= 0) return 'No tienes horas de trabajo registradas';
    const horasTrabajo = user.horasTrabajo.find((h) => h.dia === todayDate);
    if (!horasTrabajo) return 'No ha hecho check-in';
    const checkOutDate = horasTrabajo.checkOut ? new Date(horasTrabajo.checkOut) : new Date();
    const {horasDeTrabajo, minutosDeTrabajo} = calcularHorasTrabajo(new Date(horasTrabajo.checkIn), checkOutDate);
    return `${horasDeTrabajo} ${horasDeTrabajo === 1 ? 'Hora' : 'Horas'}, ${minutosDeTrabajo} Minutos`;
  }, [todayDate, user.horasTrabajo]);

  const currentHorasExtrasTrabajadas: string = useMemo(() => {
    if (user.horasTrabajo.length <= 0) return 'No tienes horas de trabajo registradas';
    const horasTrabajo = user.horasTrabajo.find((h) => h.dia === todayDate);
    if (!horasTrabajo) return 'No ha hecho check-in';
    const checkOutDate = horasTrabajo.checkOut ? new Date(horasTrabajo.checkOut) : new Date();
    const {horasDeTrabajoExtra, minutosDeTrabajoExtra} = calcularHorasTrabajo(
      new Date(horasTrabajo.checkIn),
      checkOutDate
    );
    return `${horasDeTrabajoExtra} ${horasDeTrabajoExtra === 1 ? 'Hora' : 'Horas'}, ${minutosDeTrabajoExtra} Minutos`;
  }, [todayDate, user.horasTrabajo]);

  const todayExistsInDb = useMemo(
    () => !!user.horasTrabajo?.find((h) => h.dia === todayDate),
    [todayDate, user.horasTrabajo]
  );

  const disabledCheckIn = useMemo(() => {
    const horasTrabajo = user.horasTrabajo?.find((h) => h.dia === todayDate);
    if (!horasTrabajo) return false;
    return horasTrabajo.hasCheckIn;
  }, [todayDate, user.horasTrabajo]);

  const disabledCheckOut = useMemo(() => {
    const horasTrabajo = user.horasTrabajo?.find((h) => h.dia === todayDate);
    if (!disabledCheckIn) return true;
    if (!horasTrabajo) return false;
    return horasTrabajo.hasCheckOut;
  }, [disabledCheckIn, todayDate, user.horasTrabajo]);

  return (
    <>
      <Card className="mx-2 bg-body">
        <Card.Body className="p-2 shadow">
          <Row>
            <Col className="d-flex flex-column align-items-center">
              {todayExistsInDb ? (
                <>
                  {disabledCheckOut ? (
                    <>
                      <i className="uil-cloud-check display-6 text-success"></i>
                      <h4 className="m-0 mb-1 text-dark">Has registrado tu salida.</h4>
                      <p className="d-flex justify-content-start w-100 m-0 text-body font-14">
                        Gracias por tu esfuerzo hoy. Ya has marcado la salida y podrás registrar tu entrada nuevamente
                        mañana.
                      </p>
                    </>
                  ) : (
                    <>
                      <i className="uil-check-circle display-6 text-success"></i>
                      <h4 className="m-0 mb-1 text-dark">Has registrado tu entrada.</h4>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h4 className="m-0 mb-1 text-dark">Aún no has registrado tu entrada.</h4>
                  <p className="d-flex justify-content-start w-100 m-0 text-body font-14">
                    Ya puedes marcar tu entrada. Ten en cuenta que, una vez lo hagas, no podrás repetirlo, ya que el
                    botón permanecerá deshabilitado hasta mañana.
                  </p>
                </>
              )}
              <div className="d-flex justify-content-start w-100 m-0">
                <h5 className="mb-0">Hoy {DateUtils.formatLongDate(new Date())}</h5>
              </div>
              {!disabledCheckOut && (
                <p className="d-flex justify-content-start w-100 m-0 text-body font-14">
                  Recuerda marcar la salida al finalizar tu jornada laboral.
                </p>
              )}

              <Alert className="w-100 px-2 py-1 d-flex justify-content-between mt-2 mb-0" variant="light">
                <span className="text-dark">Entrada</span>
                <span className="text-muted">{currentCheckIn}</span>
              </Alert>
              <Alert className="w-100 px-2 py-1 d-flex justify-content-between mt-1 mb-0" variant="light">
                <span className="text-dark">Salida</span>
                <span className="text-muted">{currentCheckOut}</span>
              </Alert>
              <Alert className="w-100 px-2 py-1 d-flex justify-content-between mt-1 mb-0" variant="light">
                <span className="text-dark">Horas trabajadas</span>
                <span className="text-muted">{currentHorasTrabajadas}</span>
              </Alert>
              <Alert className="w-100 px-2 py-1 d-flex justify-content-between mt-1 mb-2" variant="light">
                <span className="text-dark">Horas extras</span>
                <span className="text-muted">{currentHorasExtrasTrabajadas}</span>
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-between">
              <Button
                disabled={isSavingCheckIn || disabledCheckIn}
                className={`${!disabledCheckIn && 'rise-shake-soft'}`}
                style={{width: '49%'}}
                variant="success"
                onClick={clockIn}>
                <i className="mdi mdi-clock-in me-1"></i>
                Marcar entrada
              </Button>
              <Button
                disabled={isSavingCheckOut || disabledCheckOut}
                className={`${!disabledCheckOut && 'rise-shake-soft'}`}
                style={{width: '49%'}}
                variant="danger"
                onClick={clockOut}>
                <i className="mdi mdi-clock-out me-1"></i>
                Marcar salida
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: TOAST_DURATION,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
});

export {HorarioStatus};
