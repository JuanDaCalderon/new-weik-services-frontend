import {memo, useCallback, MouseEvent, useState, useEffect, ChangeEvent, useMemo} from 'react';
import {Card, OverlayTrigger, Tooltip, Image, Dropdown, Form} from 'react-bootstrap';
import {DateUtils, getUpdatedFields, truncateString} from '@/utils';
import {GenericModal} from '@/components/Modals/GenericModal';
import {useDatePicker, useToggle, useTogglev2} from '@/hooks';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {Link} from 'react-router-dom';
import {useDeleteNoticia, useGetNoticias, useUpdateNoticia} from '@/endpoints';
import {DatepickerRange} from '@/components/Form';
import {Noticia, noticiaCreationType} from '@/types';
import toast from 'react-hot-toast';

type NoticiaCardProps = {
  isExpanded: boolean;
  fechaExp: string;
  noticiaImg: string;
  titulo: string;
  link: string;
  hasExpired?: boolean;
  isUpcoming?: boolean;
  showStatus?: boolean;
  ableToAction?: boolean;
  noticiaId?: string;
  rangoFechas?: [Date, Date];
};

const ImageContainer = memo(function ImageContainer({
  src,
  alt,
  hasLoaded,
  objectFit = 'contain',
  onLoad
}: {
  src: string;
  alt: string;
  hasLoaded: boolean;
  objectFit?: 'contain' | 'fill';
  onLoad: () => void;
}) {
  return (
    <>
      {!hasLoaded && <SkeletonLoader customClass="p-0 m-0 position-absolute top-0 start-0 rounded z-1" />}
      <Image
        src={src}
        alt={alt}
        fluid
        loading="lazy"
        className={`w-100 h-100 object-fit-${objectFit} rounded`}
        onLoad={onLoad}
      />
    </>
  );
});

const CardFooter = memo(function CardFooter({
  isExpanded,
  titulo,
  link
}: {
  isExpanded: boolean;
  titulo: string;
  link: string;
}) {
  return (
    <div
      className={`d-flex justify-content-between align-items-center p-1 position-absolute w-100 bottom-0 ${titulo.trim() === '' && link !== '' ? '' : 'bg-gradient bg-light bg-opacity-50'}`}>
      {titulo !== '' && (
        <h5 className={`m-0 text-dark text-opacity-75 font-${isExpanded ? '14' : '12'}`}>
          {truncateString(titulo, 36)}
        </h5>
      )}
      {isExpanded && (
        <>
          {link !== '' && (
            <OverlayTrigger placement="auto" overlay={<Tooltip>Ir al enlace</Tooltip>}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark btn-sm btn-rounded py-0 px-1 m-0">
                <i className="uil-external-link-alt"></i>
              </a>
            </OverlayTrigger>
          )}
        </>
      )}
    </div>
  );
});

/**
 * Componente que corresponde a la tarjeta de una noticia.
 * En su interior tiene el modal para poder ver la imagen de la noticia en tamaño
 * completo.
 */
const NoticiaCard = memo(function NoticiaCard({
  isExpanded,
  fechaExp,
  noticiaImg,
  titulo,
  link,
  noticiaId,
  hasExpired = false,
  isUpcoming = false,
  ableToAction = false,
  showStatus = false,
  rangoFechas
}: NoticiaCardProps) {
  const noticiaDatosInicial = useMemo(() => {
    return {link, titulo};
  }, [link, titulo]);
  const rangoFechasInicial: [Date, Date | null] = useMemo(() => {
    if (rangoFechas) return [rangoFechas[0], DateUtils.addDays(rangoFechas[1], -1)];
    else return [new Date(), null];
  }, [rangoFechas]);
  const [noticiaEdit, setNoticiaEdit] = useState<noticiaCreationType>({...noticiaDatosInicial});
  const [boardImageHasLoad, setBoardImageHasLoad] = useState<boolean>(false);
  const [modalImageHasLoad, setModalImageHasLoad] = useState<boolean>(false);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const {dateRange, onDateChangeRange} = useDatePicker();
  const {isOpen, toggle, show} = useTogglev2();
  const [isOpenEdit, toggleEdit, showEdit] = useToggle();
  const [isOpenDelete, toggleDelete, showDelete] = useToggle();
  const {isDeletingTheNoticia, deleteNoticia} = useDeleteNoticia();
  const {getNoticiasSync} = useGetNoticias();
  const {isUpdatingTheNoticia, updateNoticia} = useUpdateNoticia();

  useEffect(() => {
    if (!isOpen && modalImageHasLoad) setModalImageHasLoad(false);
  }, [isOpen, modalImageHasLoad]);

  useEffect(() => {
    onDateChangeRange(rangoFechasInicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangoFechasInicial]);

  const handleExpandImage = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      show();
    },
    [show]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setNoticiaEdit((prev) => ({
        ...prev,
        [name]: value
      }));
      setHasTouched(true);
    },
    [setNoticiaEdit]
  );

  const onEditNoticia = useCallback(async () => {
    if (rangoFechas && noticiaId) {
      const noticiaUpdated = getUpdatedFields<noticiaCreationType>(noticiaDatosInicial, noticiaEdit);
      const fechasCambiaron =
        rangoFechasInicial[0].getTime() !== dateRange[0]!.getTime() ||
        (rangoFechasInicial[1] && dateRange[1] && rangoFechasInicial[1].getTime() !== dateRange[1]!.getTime());
      if (Object.keys(noticiaUpdated).length === 0 && !fechasCambiaron) {
        toggleEdit();
        toast.error('No hay cambios realizados');
        return;
      }
      if (dateRange[0] === null || dateRange[1] === null) {
        toast.error('Por favor selecciona un rango de fechas');
        return;
      }
      const dateRangeFormatted: [string, string] = [
        DateUtils.formatDateToString(dateRange[0]!),
        DateUtils.formatDateToString(DateUtils.addDays(dateRange[1]!, 1))
      ];
      const noticia: Partial<Noticia> = {
        ...noticiaUpdated,
        rangoFechas: dateRangeFormatted
      };
      await updateNoticia(noticiaId, noticia);
      toggleEdit();
      await getNoticiasSync();
    }
  }, [
    dateRange,
    getNoticiasSync,
    noticiaDatosInicial,
    noticiaEdit,
    noticiaId,
    rangoFechas,
    rangoFechasInicial,
    toggleEdit,
    updateNoticia
  ]);

  const onDeleteNoticia = useCallback(async () => {
    if (noticiaId) {
      await deleteNoticia(noticiaId);
      toggleDelete();
      await getNoticiasSync();
    }
  }, [deleteNoticia, getNoticiasSync, noticiaId, toggleDelete]);

  const onDateRangeChange = useCallback(
    (date: Date) => {
      onDateChangeRange(date);
      setHasTouched(true);
    },
    [onDateChangeRange]
  );

  return (
    <>
      <GenericModal
        show={isOpen}
        onToggle={toggle}
        variant="info"
        headerText={!titulo ? 'Noticia sin titulo' : titulo}
        showFooter={false}
        size="lg"
        body={
          <div className="w-100 position-relative ratio ratio-4x3">
            <ImageContainer
              src={noticiaImg}
              alt={titulo}
              hasLoaded={modalImageHasLoad}
              onLoad={() => setModalImageHasLoad(true)}
            />
          </div>
        }
      />
      {ableToAction && (
        <>
          <GenericModal
            show={isOpenEdit}
            onToggle={toggleEdit}
            variant="info"
            headerText={`Editar noticia ${!titulo ? 'sin titulo' : titulo}`}
            body={
              <>
                <Form.Label className="text-dark cursor-pointer mb-0" htmlFor="titulo">
                  <strong>Titulo de la noticia:</strong>
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  id="titulo"
                  name="titulo"
                  placeholder="Ingresa el titulo de la noticia (opcional)"
                  value={noticiaEdit.titulo || ''}
                  onChange={handleInputChange}
                />
                <Form.Label className="text-dark cursor-pointer mb-0 mt-1" htmlFor="link">
                  <strong>Link externo de la noticia:</strong>
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="url"
                  id="link"
                  name="link"
                  pattern="https://.*"
                  placeholder="Ingrese la URL asociada a la noticia (opcional)"
                  value={noticiaEdit.link || ''}
                  onChange={handleInputChange}
                />
                <Form.Label className="text-dark cursor-pointer mb-0 mt-1" htmlFor="rangoFechas">
                  <strong>Rango de fechas en el que va a durar esta noticia:</strong>
                </Form.Label>
                <DatepickerRange
                  dateFormat="MMMM d, yyyy"
                  isRange={true}
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={onDateRangeChange}
                />
              </>
            }
            secondaryText="Cancelar"
            submitText="Editar"
            isDisabled={!hasTouched || isUpdatingTheNoticia}
            isLoading={isUpdatingTheNoticia}
            onSend={onEditNoticia}
          />
          <GenericModal
            show={isOpenDelete}
            onToggle={toggleDelete}
            variant="danger"
            headerText={`Eliminar noticia ${!titulo ? 'sin titulo' : titulo}`}
            body={
              <p className="text-center mt-1 mb-0">
                <strong>¿Está seguro de que desea eliminar una noticia?</strong>
                <br /> Si la eliminas tanto tú como el diseñador no podrán verla de nuevo
              </p>
            }
            secondaryText="Cancelar"
            submitText="Eliminar"
            isDisabled={isDeletingTheNoticia}
            isLoading={isDeletingTheNoticia}
            onSend={onDeleteNoticia}
          />
        </>
      )}
      <Card className="p-0 m-0 w-100 h-100 rounded">
        <Card.Body className="p-0 m-0 w-100 h-100 position-relative rounded ribbon-box">
          {isExpanded && (
            <OverlayTrigger placement="auto" overlay={<Tooltip>{fechaExp}</Tooltip>}>
              <i
                className={`d-flex justify-content-center align-items-center uil-info-circle position-absolute font-18 rounded-5 m-1 cursor-pointer bg-opacity-75 z-3 ${hasExpired ? 'bg-danger text-white' : 'bg-light'} `}
                style={{width: '24px', height: '24px'}}
              />
            </OverlayTrigger>
          )}
          {hasExpired && (
            <div
              className="ribbon-two ribbon-two-danger z-1"
              style={{left: '0px', top: '0px', width: '100px', height: '100px'}}>
              <span style={{width: '150px', left: '-30px', top: '32px'}}>Expirada</span>
            </div>
          )}
          {isUpcoming && (
            <div
              className="ribbon-two ribbon-two-primary z-0"
              style={{left: '0px', top: '0px', width: '100px', height: '100px'}}>
              <span style={{width: '150px', left: '-30px', top: '32px'}}>Próximamente</span>
            </div>
          )}
          {showStatus && !isUpcoming && !hasExpired && (
            <div
              className="ribbon-two ribbon-two-success z-0"
              style={{left: '0px', top: '0px', width: '100px', height: '100px'}}>
              <span style={{width: '150px', left: '-30px', top: '32px'}}>En progreso</span>
            </div>
          )}
          {ableToAction && (
            <Dropdown className="position-absolute top-0 end-0 z-2">
              <Dropdown.Toggle as={Link} to={''} className="d-flex arrow-none text-dark z-2">
                <i className="mdi mdi-dots-vertical font-24 bg-light rounded bg-opacity-10 z-2" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className="m-0 p-0">
                <Dropdown.Item className="m-0 px-2" onClick={showEdit}>
                  <i className="uil uil-edit-alt me-1" />
                  Editar noticia
                </Dropdown.Item>
                <Dropdown.Divider className="m-0 p-0" />
                <Dropdown.Item className="m-0 px-2" onClick={showDelete}>
                  <i className="uil uil-trash" /> Eliminar noticia
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          <a href="#" role="button" onClick={handleExpandImage} className="rounded">
            <ImageContainer
              src={noticiaImg}
              alt={titulo}
              hasLoaded={boardImageHasLoad}
              objectFit="fill"
              onLoad={() => setBoardImageHasLoad(true)}
            />
          </a>
          {(titulo !== '' || link !== '') && <CardFooter isExpanded={isExpanded} titulo={titulo} link={link} />}
        </Card.Body>
      </Card>
    </>
  );
});

export {NoticiaCard};
