import {memo, useCallback, useEffect, useMemo, useState, MouseEvent} from 'react';
import {Button, Card, Col} from 'react-bootstrap';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Mousewheel, Pagination, Autoplay} from 'swiper/modules';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {NoticiaCard} from './NoticiaCard';
import {useAppSelector} from '@/store';
import {selectIsLoadingNoticias, selectNoticias} from '@/store/selectores';
import {useGetNoticias} from '@/endpoints';
import {MapNoticia, Noticia} from '@/types';
import {DateUtils, filtrarElementosVigentes, LocalStorageUtil} from '@/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import {LOCALSTORAGE_EXPAND_NOTICIAS_BOARD, noticiasMockData} from '@/constants';

/**
 * Componente que contiene el tablero de noticias en vertical.
 * Aqui tambien esta el boton para expandir o contraer el tablero.
 * Este componente devuelve un Col de bootstrap, por lo que debe ser
 * utilizado dentro de un Row.
 */
const TableroNoticias = memo(function TableroNoticias() {
  const [isExpanded, setIsExpanded] = useState<boolean>(
    LocalStorageUtil.getItem<boolean>(LOCALSTORAGE_EXPAND_NOTICIAS_BOARD) ?? true
  );
  const isLoadingNews = useAppSelector(selectIsLoadingNoticias);
  const noticiasFromStore = useAppSelector(selectNoticias);
  const {getNoticiasSync} = useGetNoticias();

  useEffect(() => {
    if (noticiasFromStore.length <= 0) getNoticiasSync();
  }, [getNoticiasSync, noticiasFromStore.length]);

  const onClickExpandNoticias = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsExpanded((prev) => {
      LocalStorageUtil.setItem<boolean>(LOCALSTORAGE_EXPAND_NOTICIAS_BOARD, !prev);
      return !prev;
    });
  }, []);

  const syncNoticias = useCallback(() => {
    getNoticiasSync();
  }, [getNoticiasSync]);

  const noticiasData: MapNoticia[] = useMemo(() => {
    if (noticiasFromStore.length === 0) return [];
    const noticiasFiltradas: Noticia[] = filtrarElementosVigentes(noticiasFromStore);
    if (noticiasFiltradas.length > 0) {
      return noticiasFiltradas.map((noticia) => {
        const expDate: string | undefined = [...noticia.rangoFechas].pop();
        return {
          id: noticia.id,
          expFechas: `Esta publicación desaparecerá del tablero el día ${DateUtils.formatShortDate(expDate ? new Date(expDate) : new Date(), true)}`,
          image: noticia.image,
          link: noticia.link,
          titulo: noticia.titulo
        };
      });
    } else return [];
  }, [noticiasFromStore]);

  const slidesPerView: number = useMemo(() => {
    return isExpanded ? 3 : 6;
  }, [isExpanded]);

  return (
    <Col className="p-0 m-0" xs={12} lg={3} xxl={isExpanded ? 2 : 1}>
      <Card>
        <Card.Body className="position-relative">
          <Card.Header className="p-0 pb-1 d-flex align-items-center gap-2">
            <h4 className="header-title text-dark text-opacity-75 d-flex align-items-center w-auto m-0 pb-0 pt-1">
              {isExpanded ? 'Tablero de noticias' : 'Noticias'}
            </h4>
            {isExpanded && (
              <Button
                disabled={isLoadingNews}
                onClick={syncNoticias}
                size="sm"
                variant="outline-light"
                className="btn-icon py-0 px-1 m-0 d-flex align-items-center">
                <i className="uil uil-sync p-0 m-0"></i>
              </Button>
            )}
          </Card.Header>
          <button
            onClick={onClickExpandNoticias}
            className="btn btn-sm btn-primary-hover position-absolute p-0 mt-1 me-1 border-0 top-0 end-0">
            <i className={`mdi mdi-arrow-${isExpanded ? 'left' : 'right'}-drop-circle h2`}></i>
          </button>
          {isLoadingNews ? (
            <SkeletonLoader customClass="p-0 m-0" height="68vh" />
          ) : (
            <Swiper
              style={{height: 'calc(75vh - var(--ct-topbar-height))'}}
              slidesPerView={slidesPerView}
              spaceBetween={isExpanded ? 30 : 20}
              grabCursor={true}
              loop={noticiasData.length > slidesPerView}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false
              }}
              mousewheel={true}
              direction="vertical"
              pagination={{clickable: true}}
              modules={[Mousewheel, Pagination, Autoplay]}>
              {[...noticiasData, ...noticiasMockData].map((noticia, index) => {
                return (
                  <SwiperSlide className="rounded" key={`${noticia.id}_${index}`}>
                    <NoticiaCard
                      key={`${noticia.id}_${index}`}
                      fechaExp={noticia.expFechas}
                      isExpanded={isExpanded}
                      noticiaImg={noticia.image}
                      titulo={noticia.titulo}
                      link={noticia.link}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
});

export {TableroNoticias};
