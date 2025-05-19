import {OBJETIVO_STATUS, Objetivos, SelfAssessment} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {GenericModal} from '@/components/Modals/GenericModal';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Badge, Button, OverlayTrigger, ProgressBar, Tooltip} from 'react-bootstrap';
import {useTogglev2} from '@/hooks';
import {DateUtils, truncateString} from '@/utils';
import {RIBBONTYPES} from '@/constants';
import {useSelfEvaluate} from '@/endpoints';
import {StarRating} from '@/components/Form2';
import {AutoEvaluar} from './AutoEvaluar';

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

const AutoevaluacionColumn = memo(function AutoevaluacionColumn({row}: {row: Row<Objetivos>}) {
  const [selfAssessment, setSelfAssessment] = useState<Partial<SelfAssessment>>({});
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const [rating, setRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const {show, isOpen, toggle} = useTogglev2();
  const {SelfEvaluate, isSelfEvaluate} = useSelfEvaluate();

  const wasAlreadyRequesedSelfAssessment = useMemo(
    () => row.original.requiredSelfAssessment === true,
    [row.original.requiredSelfAssessment]
  );

  const wasAlreadySelfEvaluated = useMemo(
    () => row.original.selfAssessment !== undefined,
    [row.original.selfAssessment]
  );

  useEffect(() => {
    if (wasAlreadySelfEvaluated) {
      setSelfAssessment({
        comment: row.original.selfAssessment?.comment,
        stars: row.original.selfAssessment?.stars
      });
      setRating(row.original.selfAssessment?.stars || 0);
    } else {
      setSelfAssessment({});
      setRating(0);
    }
  }, [row.original.selfAssessment?.comment, row.original.selfAssessment?.stars, wasAlreadySelfEvaluated]);

  const overalyText: string = useMemo(() => {
    if (!wasAlreadyRequesedSelfAssessment) return 'Aún no se ha solicitado tu autoevaluación';
    if (wasAlreadySelfEvaluated) return 'Ver autoevaluación';
    if (wasAlreadyRequesedSelfAssessment) return 'Realizar autoevaluación';
    return 'Autoevaluación';
  }, [wasAlreadyRequesedSelfAssessment, wasAlreadySelfEvaluated]);

  const variantValue: string = useMemo(() => {
    if (!wasAlreadyRequesedSelfAssessment) return 'danger';
    if (wasAlreadySelfEvaluated) return 'success';
    if (wasAlreadyRequesedSelfAssessment) return 'info';
    return 'secondary';
  }, [wasAlreadyRequesedSelfAssessment, wasAlreadySelfEvaluated]);

  const onSendSelfEvaluation = useCallback(async () => {
    const objetivoSelfEvaluado: Objetivos = {
      selfAssessment: {
        comment: selfAssessment.comment || '',
        stars: rating || 0,
        wasReviewed: false
      }
    } as Objetivos;
    await SelfEvaluate(row.original.id, objetivoSelfEvaluado.selfAssessment!);
    toggle();
  }, [SelfEvaluate, rating, row.original.id, selfAssessment.comment, toggle]);

  return (
    <>
      <OverlayTrigger overlay={<Tooltip id="selfAssessment">{overalyText}</Tooltip>}>
        <Button
          id="selfAssessment"
          variant={`outline-${variantValue} py-0 px-1`}
          onClick={() => {
            if (wasAlreadyRequesedSelfAssessment) show();
          }}>
          <i className="uil-feedback" />
        </Button>
      </OverlayTrigger>
      <GenericModal
        show={isOpen}
        onToggle={toggle}
        variant={wasAlreadySelfEvaluated ? 'success' : 'primary'}
        headerText="Autoevaluación"
        showSendButton={!wasAlreadySelfEvaluated}
        onSend={onSendSelfEvaluation}
        isDisabled={!hasTouched || isSelfEvaluate}
        isLoading={isSelfEvaluate}
        submitText="Enviar"
        body={
          <AutoEvaluar
            evaluacion={selfAssessment}
            rating={rating}
            setEvaluacion={setSelfAssessment}
            setRating={setRating}
            setHasTouched={setHasTouched}
            isDisabledInput={wasAlreadySelfEvaluated}
          />
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
    header: 'Autoevaluación',
    accessorKey: 'selfAssessment',
    cell: AutoevaluacionColumn
  }
];

export {columns};
