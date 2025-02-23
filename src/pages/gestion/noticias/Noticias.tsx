import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Card, Col, Row} from 'react-bootstrap';
import {FileType, GenericModal, PageBreadcrumb} from '@/components';
import {useAppSelector} from '@/store';
import {useAddNoticia, useGetNoticias, useUploadImage} from '@/endpoints';
import {selectIsLoadingNoticias, selectNoticias} from '@/store/selectores';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {STORAGE_NOTICIAS_PATH, TOAST_DURATION} from '@/constants';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Grid, Mousewheel, Pagination} from 'swiper/modules';
import {NoticiaCard} from '@/components/Noticias';
import {useDatePicker, useFileManager, useToggle} from '@/hooks';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import {CrearNoticiaBodyModal} from './CrearNoticiaBodyModal';
import {MapNoticia, Noticia, noticiaCreationType} from '@/types';
import toast, {Toaster} from 'react-hot-toast';
import {DateUtils} from '@/utils';

const Noticias = memo(function Noticias() {
  const [shouldResetImage, setShouldResetImage] = useState<boolean>(false);
  const [isReadyToBeSend, setIsReadyToBeSend] = useState<boolean>(false);
  const [noticiaCreation, setNoticiaCreation] = useState<noticiaCreationType>({link: '', titulo: ''});
  const [crearNoticiaOpen, crearNoticiaToggle] = useToggle();
  const isLoadingNews = useAppSelector(selectIsLoadingNoticias);
  const noticiasFromStore = useAppSelector(selectNoticias);
  const {getNoticiasSync} = useGetNoticias();
  const {dateRange, onDateChangeRange} = useDatePicker();
  const {file, handleFile, handleFileRemoved} = useFileManager();
  const {isLoadingUploadImage, uploadImage} = useUploadImage();
  const {isSavingTheNoticia, addNoticia} = useAddNoticia();

  useEffect(() => {
    if (noticiasFromStore.length <= 0) getNoticiasSync();
  }, [getNoticiasSync, noticiasFromStore.length]);

  const noticiasData: MapNoticia[] = useMemo(() => {
    if (noticiasFromStore.length === 0) return [];
    return noticiasFromStore.map((noticia) => {
      const expDate: string | undefined = [...noticia.rangoFechas].pop();
      const hasExpired = DateUtils.hasExpired(expDate ?? new Date());
      let expFechas = `Esta noticia desaparecerá del tablero el día ${DateUtils.formatShortDate(expDate ? new Date(expDate) : new Date())}`;
      if (hasExpired)
        expFechas = `Esta noticia ha expirado el día ${DateUtils.formatShortDate(expDate ? new Date(expDate) : new Date())}`;
      return {
        id: noticia.id,
        expFechas: expFechas,
        image: noticia.image,
        link: noticia.link,
        titulo: noticia.titulo,
        rangoFechas: noticia.rangoFechas.map((date) => DateUtils.parseStringToDate(date)),
        hasExpired
      } as MapNoticia;
    });
  }, [noticiasFromStore]);

  const handleFileUpload = useCallback(
    (file: FileType) => {
      setShouldResetImage(false);
      handleFile(file);
      setIsReadyToBeSend(true);
    },
    [handleFile]
  );

  const syncNoticias = useCallback(() => {
    getNoticiasSync();
  }, [getNoticiasSync]);

  const onSendCrearNoticia = useCallback(async () => {
    if (!file) {
      toast.error('No hay ninguna noticia subida para crear');
      crearNoticiaToggle();
      setIsReadyToBeSend(false);
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
    const imgName = `${file.name.replaceAll('.', '_')}_${DateUtils.getDateOnly(new Date(), '_')}`;
    const imgUrl = await uploadImage(STORAGE_NOTICIAS_PATH, imgName, file);
    const noticia: Noticia = {
      image: imgUrl,
      link: noticiaCreation.link ?? '',
      titulo: noticiaCreation.titulo ?? '',
      rangoFechas: dateRangeFormatted
    } as Noticia;
    await addNoticia(noticia);
    crearNoticiaToggle();
    await getNoticiasSync();
  }, [
    addNoticia,
    crearNoticiaToggle,
    dateRange,
    file,
    getNoticiasSync,
    noticiaCreation.link,
    noticiaCreation.titulo,
    uploadImage
  ]);

  return (
    <>
      <GenericModal
        show={crearNoticiaOpen}
        onToggle={crearNoticiaToggle}
        variant="success"
        headerText="Crear Noticia"
        submitText="Crear"
        secondaryText="Cerrar"
        body={
          <CrearNoticiaBodyModal
            formData={noticiaCreation}
            setFormData={setNoticiaCreation}
            handleFileUpload={handleFileUpload}
            handleFileRemoved={handleFileRemoved}
            shouldResetImage={shouldResetImage}
            dateRange={dateRange}
            onDateChangeRange={onDateChangeRange}
          />
        }
        isDisabled={!isReadyToBeSend || isLoadingUploadImage || isSavingTheNoticia}
        isLoading={isSavingTheNoticia || isLoadingUploadImage}
        onSend={onSendCrearNoticia}
      />
      <PageBreadcrumb title="Gestión Noticias" />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body className="position-relative">
              <Card.Header className="p-0 d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex align-items-center gap-2">
                  <h4 className="header-title text-dark text-opacity-75 d-flex align-items-center w-auto m-0 pb-0 pt-1">
                    Tablero de noticias
                  </h4>
                  <Button
                    disabled={isLoadingNews}
                    onClick={syncNoticias}
                    size="sm"
                    variant="outline-light"
                    className="btn-icon py-0 px-1 m-0 d-flex align-items-center">
                    <i className="uil uil-sync p-0 m-0"></i>
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="shadow-sm"
                  style={{maxWidth: '175px'}}
                  variant="success"
                  onClick={crearNoticiaToggle}>
                  <i className="mdi mdi-newspaper-plus me-1" /> Crear Noticia
                </Button>
              </Card.Header>
              {isLoadingNews ? (
                <SkeletonLoader customClass="p-0 m-0" height="67vh" />
              ) : (
                <Swiper
                  style={{height: 'calc(74vh - var(--ct-topbar-height))'}}
                  slidesPerView={1}
                  spaceBetween={10}
                  grid={{rows: 3}}
                  breakpoints={{
                    576: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                      grid: {rows: 3}
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                      grid: {rows: 2}
                    },
                    1400: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                      grid: {rows: 2}
                    }
                  }}
                  mousewheel={true}
                  pagination={{clickable: true}}
                  modules={[Mousewheel, Pagination, Grid]}>
                  {noticiasData.map((noticia, index) => {
                    return (
                      <SwiperSlide className="rounded" key={`${noticia.id}_${index}`}>
                        <NoticiaCard
                          key={`${noticia.id}_${index}`}
                          fechaExp={noticia.expFechas}
                          isExpanded={true}
                          noticiaImg={noticia.image}
                          titulo={noticia.titulo}
                          link={noticia.link}
                          hasExpired={noticia.hasExpired}
                          noticiaId={noticia.id}
                          rangoFechas={noticia.rangoFechas}
                          ableToAction
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
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

export {Noticias};
