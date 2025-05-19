import {Evaluation, OBJETIVO_STATUS, Objetivos} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {GenericModal} from '@/components/Modals/GenericModal';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Badge, Button, Col, Form, OverlayTrigger, ProgressBar, Tooltip} from 'react-bootstrap';
import {useTogglev2} from '@/hooks';
import {DateUtils, getNombreCompletoUser, truncateString} from '@/utils';
import {RIBBONTYPES} from '@/constants';
import {EvaluarObjetivo} from './EvaluarObjetivo';
import {useAppSelector} from '@/store';
import {selectEmployees} from '@/store/selectores';
import {useEvaluateObjetivos, useGetObjetivos, useRequiredSelfAssessment} from '@/endpoints';
import {StarRating} from '@/components/Form2';

const TituloColumn = memo(function TituloColumn({row}: {row: Row<Objetivos>}) {
  return (
    <div className="d-flex align-items-center table-user">
      <i className="mdi mdi-crown" />
      <div className="ms-1 d-flex flex-column">
        <span className="m-0 lh-sm fw-bold text-uppercase text-dark text-opacity-75 d-inline">
          {truncateString(row.original.titulo, 28)}
        </span>
        <span className="m-0 lh-sm d-inline">{truncateString(row.original.descripcion, 34)}</span>
      </div>
    </div>
  );
});

const FechasColumn = memo(function FechasColumn({row}: {row: Row<Objetivos>}) {
  const [fechaInicio, fechaFin] = useMemo(
    () => row.original.rangoFechas.map((date) => DateUtils.parseStringToDate(date)),
    [row.original.rangoFechas]
  );

  const wasAlreadyEvaluated = useMemo(() => {
    return row.original.evaluation !== undefined;
  }, [row.original.evaluation]);

  const {expirado, progreso} = useMemo(() => {
    const hoy = new Date();
    const total = fechaFin.getTime() - fechaInicio.getTime();
    const transcurrido = hoy.getTime() - fechaInicio.getTime();
    if (hoy < fechaInicio) return {progreso: 0, expirado: false};
    if (hoy > fechaFin) return {progreso: 100, expirado: true};
    const progreso = (transcurrido / total) * 100;
    return {progreso, expirado: false};
  }, [fechaFin, fechaInicio]);

  return (
    <div>
      <div className="d-flex justify-content-center pb-1">
        <span className="font-12 lh-1">{DateUtils.formatShortDate(fechaInicio)}</span>
        <span className="font-12 lh-1 mx-1"> - </span>
        <span className="font-12 lh-1">{DateUtils.formatShortDate(fechaFin)}</span>
      </div>
      {wasAlreadyEvaluated && <ProgressBar now={100} label={`Evaluada`} variant="success" />}
      {!wasAlreadyEvaluated && progreso === 0 && <ProgressBar now={100} label={`Sin iniciar`} variant="secondary" />}
      {!wasAlreadyEvaluated && progreso !== 0 && (
        <ProgressBar
          now={progreso}
          label={expirado ? `Expirado` : `${Math.floor(progreso)}%`}
          variant={expirado ? 'danger' : 'info'}
          animated={!expirado}
          striped={!expirado}
        />
      )}
    </div>
  );
});

const EstadosColumn = memo(function EstadosColumn({row}: {row: Row<Objetivos>}) {
  const wasAlreadyEvaluated = useMemo(() => {
    return row.original.evaluation !== undefined;
  }, [row.original.evaluation]);

  const ribbonType = useMemo(() => {
    const estado = row.original.status;
    const fechaExpiracion = row.original.rangoFechas[1];
    const estadoMap: Record<string, RIBBONTYPES> = {
      [OBJETIVO_STATUS.COMPLETADO]: RIBBONTYPES.success,
      [OBJETIVO_STATUS.EN_PROGRESO]: RIBBONTYPES.info,
      [OBJETIVO_STATUS.PENDIENTE]: RIBBONTYPES.warning
    };
    if (fechaExpiracion && new Date(fechaExpiracion) < new Date()) return RIBBONTYPES.danger;
    return estadoMap[estado] || RIBBONTYPES.info;
  }, [row.original.rangoFechas, row.original.status]);
  return (
    <div className="position-relative d-flex align-items-center flex-wrap column-gap-1">
      <Badge bg="" pill className={`no-user-text-selectable badge-outline-${ribbonType} font-14`}>
        {row.original.status}
      </Badge>
      {wasAlreadyEvaluated && <StarRating disabled value={row.original.evaluation?.stars || 0} />}
    </div>
  );
});

const ObjetivosAcciones = memo(function UsuariosAcciones({row}: {row: Row<Objetivos>}) {
  const [evaluacion, setEvaluacion] = useState<Partial<Evaluation>>({});
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const [rating, setRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const {show: showEvaluar, isOpen: isOpenEvaluar, toggle: toggleEvaluar} = useTogglev2();
  const {show: showSelfAssessment, isOpen: isOpenSelfAssessment, toggle: toggleSelfAssessment} = useTogglev2();
  const {
    show: showSelfAssessmentResult,
    isOpen: isOpenSelfAssessmentResult,
    toggle: toggleSelfAssessmentResult
  } = useTogglev2();
  const users = useAppSelector(selectEmployees);
  const {getObjetivosSync} = useGetObjetivos();
  const {evaluateObjetivo, isEvaluateTheObjetivo} = useEvaluateObjetivos();
  const {isRequiredSelfAssessment, requiredSelfAssessment} = useRequiredSelfAssessment();
  const userSelected = useMemo(
    () => users.find((user) => user.id === row.original.userId),
    [row.original.userId, users]
  );
  const onSendEvaluation = useCallback(async () => {
    const objetivoEvaluado: Objetivos = {
      evaluation: {
        feedback: evaluacion.feedback || '',
        stars: rating || 0,
        wasReviewed: false
      }
    } as Objetivos;
    await evaluateObjetivo(row.original.id, objetivoEvaluado.evaluation!);
    toggleEvaluar();
    await getObjetivosSync();
  }, [evaluacion.feedback, evaluateObjetivo, getObjetivosSync, rating, row.original.id, toggleEvaluar]);
  const wasAlreadyEvaluated = useMemo(() => {
    return row.original.evaluation !== undefined;
  }, [row.original.evaluation]);
  useEffect(() => {
    if (wasAlreadyEvaluated) {
      setEvaluacion({
        feedback: row.original.evaluation?.feedback,
        stars: row.original.evaluation?.stars
      });
      setRating(row.original.evaluation?.stars || 0);
    } else {
      setEvaluacion({});
      setRating(0);
    }
  }, [row.original.evaluation?.feedback, row.original.evaluation?.stars, wasAlreadyEvaluated]);

  const wasAlreadyRequesedSelfAssessment = useMemo(
    () => row.original.requiredSelfAssessment === true,
    [row.original.requiredSelfAssessment]
  );

  const wasAlreadySelfEvaluated = useMemo(
    () => row.original.selfAssessment !== undefined,
    [row.original.selfAssessment]
  );

  const onSendSelfAssessment = useCallback(async () => {
    await requiredSelfAssessment(row.original.id);
    toggleSelfAssessment();
    await getObjetivosSync();
  }, [getObjetivosSync, requiredSelfAssessment, row.original.id, toggleSelfAssessment]);

  return (
    <>
      <div className="d-flex column-gap-1">
        <OverlayTrigger
          overlay={<Tooltip id="evaluar">{wasAlreadyEvaluated ? 'Ver evaluación previa' : 'Evaluar'}</Tooltip>}>
          <Button
            id="evaluar"
            variant={`outline-${wasAlreadyEvaluated ? 'success' : 'info'} py-0 px-1`}
            onClick={showEvaluar}>
            <i className="uil-star" />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip id="selfAssessment">
              {wasAlreadyRequesedSelfAssessment ? 'Ver autoevaluación' : 'solicitar autoevaluación'}
            </Tooltip>
          }>
          <Button
            id="selfAssessment"
            variant={`outline-${wasAlreadySelfEvaluated ? 'success' : 'info'} py-0 px-1`}
            onClick={() => {
              if (wasAlreadyRequesedSelfAssessment) showSelfAssessmentResult();
              else showSelfAssessment();
            }}>
            <i className="uil-feedback" />
          </Button>
        </OverlayTrigger>
      </div>
      <GenericModal
        show={isOpenEvaluar}
        onToggle={toggleEvaluar}
        variant={wasAlreadyEvaluated ? 'success' : 'primary'}
        headerText={`${!wasAlreadyEvaluated ? 'Evaluar' : ''} Objetivo de ${userSelected ? getNombreCompletoUser(userSelected) : ''}`}
        isDisabled={!hasTouched || isEvaluateTheObjetivo}
        isLoading={isEvaluateTheObjetivo}
        showSendButton={!wasAlreadyEvaluated}
        onSend={onSendEvaluation}
        submitText="Evaluar"
        body={
          <EvaluarObjetivo
            evaluacion={evaluacion}
            setEvaluacion={setEvaluacion}
            setHasTouched={setHasTouched}
            rating={rating}
            setRating={setRating}
            isDisabledInput={wasAlreadyEvaluated}
          />
        }
      />
      <GenericModal
        show={isOpenSelfAssessment}
        onToggle={toggleSelfAssessment}
        variant="primary"
        headerText={`Autoevaluación de ${userSelected ? getNombreCompletoUser(userSelected) : ''}`}
        onSend={onSendSelfAssessment}
        isDisabled={isRequiredSelfAssessment}
        isLoading={isRequiredSelfAssessment}
        submitText="Solicitar"
        body={
          <div className="m-0 p-0">
            <p className="m-0 p-0">
              Enviar una solicitud a <strong>{userSelected ? getNombreCompletoUser(userSelected) : ''}</strong> para que
              complete su autoevaluación. Esta acción no se puede deshacer. La autoevaluación estará disponible una vez
              que el usuario la haya completado.
            </p>
          </div>
        }
      />
      <GenericModal
        show={isOpenSelfAssessmentResult}
        onToggle={toggleSelfAssessmentResult}
        variant="primary"
        headerText={`Autoevaluación de ${userSelected ? getNombreCompletoUser(userSelected) : ''}`}
        showDeleteButton={false}
        showSendButton={false}
        body={
          <div className="row">
            {wasAlreadySelfEvaluated ? (
              <>
                <Col xs={12}>
                  <Form.Label className="mb-0">
                    <strong>Estrellas</strong>
                  </Form.Label>
                  <StarRating value={row.original.selfAssessment?.stars || 0} disabled />
                </Col>
                <Col xs={12}>
                  <Form.Label className="mb-0">
                    <strong>Autoevaluación</strong>
                  </Form.Label>
                  <p>{row.original.selfAssessment?.comment || ''}</p>
                </Col>
              </>
            ) : (
              <Col>
                <p className="text-danger font-14 m-0">El usuario no ha completado su autoevaluación</p>
              </Col>
            )}
          </div>
        }
      />
    </>
  );
});

const columns: ColumnDef<Objetivos>[] = [
  {
    header: 'Titulo',
    accessorKey: 'titulo',
    cell: TituloColumn
  },
  {
    header: 'Fechas',
    accessorKey: 'rangoFechas',
    cell: FechasColumn
  },
  {
    header: 'Estado',
    accessorKey: 'status',
    cell: EstadosColumn
  },
  {
    header: 'Evaluar',
    accessorKey: 'evaluar',
    cell: ObjetivosAcciones
  }
];

export {columns};
