import {PageBreadcrumb} from '@/components';
import {memo, useCallback, MouseEvent, useState} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {Toaster} from 'react-hot-toast';
import {Mousewheel, Pagination, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.scss';
import {TOAST_DURATION} from '@/constants';

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
                spaceBetween={isExpanded ? 30 : 20}
                grabCursor={true}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false
                }}
                mousewheel={true}
                direction="vertical"
                pagination={{clickable: true}}
                modules={[Mousewheel, Pagination, Autoplay]}>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-1.jpg" loading="lazy" />
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
