import {PageBreadcrumb} from '@/components';
import {memo, useCallback, MouseEvent, useState} from 'react';
import {Button, Card, Col, Row, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Toaster} from 'react-hot-toast';
import {Mousewheel, Pagination, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.scss';
import {TOAST_DURATION} from '@/constants';
import {truncateString} from '@/utils';

const Noticias = memo(function Noticias() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const onClickExpandNoticias = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsExpanded((prev) => !prev);
  }, []);

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

              <Swiper
                slidesPerView={isExpanded ? 3 : 6}
                spaceBetween={isExpanded ? 20 : 10}
                grabCursor={true}
                loop={true}
                /* autoplay={{
                  delay: 5000,
                  disableOnInteraction: false
                }} */
                mousewheel={true}
                direction="vertical"
                pagination={{clickable: true}}
                modules={[Mousewheel, Pagination, Autoplay]}>
                <SwiperSlide>
                  <Card className="p-0 m-0 w-100 h-100">
                    <Card.Body className="p-0 m-0 w-100 h-100 position-relative">
                      {isExpanded && (
                        <OverlayTrigger placement="auto" overlay={<Tooltip>fecha exp</Tooltip>}>
                          <i
                            className="d-flex justify-content-center align-items-center uil-info-circle position-absolute font-18 bg-light rounded-5 m-1 cursor-pointer bg-opacity-75"
                            style={{width: '24px', height: '24px'}}
                          />
                        </OverlayTrigger>
                      )}
                      <a href="google.com" target="blank">
                        <img
                          className="img img-fluid w-100 h-100 object-fit-cover"
                          src="https://swiperjs.com/demos/images/nature-1.jpg"
                          loading="lazy"
                        />
                      </a>

                      <div className="d-flex justify-content-between align-items-center p-1 position-absolute w-100 bottom-0 bg-gradient bg-light bg-opacity-50">
                        <h5
                          className={`m-0 text-dark text-opacity-75 font-${isExpanded ? '14' : '12'}`}>
                          {isExpanded ? (
                            <>Titulo Titulo Titulo Titulo Titulo Titulo</>
                          ) : (
                            <>{truncateString('Titulo Titulo Titulo Titulo Titulo Titulo', 23)}</>
                          )}
                        </h5>
                        {isExpanded && (
                          <Button
                            size="sm"
                            variant="outline-dark"
                            className="btn-rounded py-0 px-1 m-0">
                            <i className="uil-external-link-alt"></i>
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-2.jpg" loading="lazy" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-3.jpg" loading="lazy" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-4.jpg" loading="lazy" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-5.jpg" loading="lazy" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-6.jpg" loading="lazy" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-7.jpg" loading="lazy" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-8.jpg" loading="lazy" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-9.jpg" loading="lazy" />
                </SwiperSlide>
              </Swiper>
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
