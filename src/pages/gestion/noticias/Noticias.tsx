import {memo, useCallback} from 'react';
import {Button, Card, Col, Row} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import {useAppSelector} from '@/store';
import {useGetNoticias} from '@/endpoints';
import {selectIsLoadingNoticias, selectNoticias} from '@/store/selectores';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {noticiasMockData} from '@/constants';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Grid, Mousewheel, Pagination} from 'swiper/modules';
import {NoticiaCard} from '@/components/Noticias';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';

const Noticias = memo(function Noticias() {
  const isLoadingNews = useAppSelector(selectIsLoadingNoticias);
  const _noticiasFromStore = useAppSelector(selectNoticias);
  const {getNoticiasSync} = useGetNoticias();

  const syncNoticias = useCallback(() => {
    getNoticiasSync();
  }, [getNoticiasSync]);

  const crearNoticia = useCallback(() => {
    console.log('Crear noticia');
  }, []);

  return (
    <>
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
                  onClick={crearNoticia}>
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
                  {noticiasMockData.map((noticia, index) => {
                    return (
                      <SwiperSlide className="rounded" key={`${noticia.id}_${index}`}>
                        <NoticiaCard
                          key={`${noticia.id}_${index}`}
                          fechaExp={noticia.expFechas}
                          isExpanded={true}
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
