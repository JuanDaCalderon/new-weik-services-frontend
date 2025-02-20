import {PageBreadcrumb} from '@/components';
import {NoticiaCard} from '@/components/Noticias/NoticiaCard';
import {memo, useCallback, MouseEvent, useState, useEffect, useMemo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {Mousewheel, Pagination, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import {MapNoticia, Noticia} from '@/types';
import {useGetNoticias} from '@/endpoints';
import {useAppSelector} from '@/store';
import {selectIsLoadingNoticias, selectNoticias} from '@/store/selectores';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {DateUtils, filtrarElementosVigentes} from '@/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.scss';

const Noticias = memo(function Noticias() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const isLoadingNews = useAppSelector(selectIsLoadingNoticias);
  const noticiasFromStore = useAppSelector(selectNoticias);
  const {getNoticiasSync} = useGetNoticias();

  useEffect(() => {
    if (noticiasFromStore.length <= 0) getNoticiasSync();
  }, [getNoticiasSync, noticiasFromStore.length]);

  const onClickExpandNoticias = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsExpanded((prev) => !prev);
  }, []);

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
    <>
      <PageBreadcrumb title="Gestión Noticias" />
      <Row>
        <Col className="p-0 m-0" xs={12} lg={3} xxl={isExpanded ? 2 : 1}>
          <Card>
            <Card.Body className="position-relative">
              <Card.Header className="p-0">
                <h4 className="header-title text-dark text-opacity-75">
                  {isExpanded ? 'Tablero de noticias' : 'Noticias'}
                </h4>
              </Card.Header>
              <button
                onClick={onClickExpandNoticias}
                className="btn btn-sm btn-primary-hover position-absolute p-0 mt-1 me-1 border-0 top-0 end-0">
                <i className={`mdi mdi-arrow-${isExpanded ? 'left' : 'right'}-drop-circle h2`}></i>
              </button>
              {isLoadingNews ? (
                <SkeletonLoader customClass="p-0 m-0" height="65vh" />
              ) : (
                <Swiper
                  slidesPerView={slidesPerView}
                  spaceBetween={isExpanded ? 20 : 10}
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
                  {noticiasData.map((noticia, index) => {
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
      </Row>
    </>
  );
});

export {Noticias};
