import {PageBreadcrumb} from '@/components';
import {NoticiaCard} from '@/components/Noticias/NoticiaCard';
import {memo, useCallback, MouseEvent, useState} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {Toaster} from 'react-hot-toast';
import {Mousewheel, Pagination, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.scss';
import {TOAST_DURATION} from '@/constants';
import {MapNoticia} from '@/types';

const noticiasData: MapNoticia[] = [
  {
    id: '1',
    expFechas: '2005',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Aspect_ratio_-_16x9.svg/1200px-Aspect_ratio_-_16x9.svg.png',
    link: 'https://www.youtube.com/watch?v=ZPUZwriSX4M&list=RDGMEMJQXQAmqrnmK1SEjY_rKBGAVMZPUZwriSX4M&start_radio=1&ab_channel=Slipknot',
    titulo: 'Titulo Titulo Titulo Titulo Titulo 1'
  },
  {
    id: '2',
    expFechas: '2006',
    image: 'https://swiperjs.com/demos/images/nature-2.jpg',
    link: 'https://www.youtube.com/watch?v=ZPUZwriSX4M&list=RDGMEMJQXQAmqrnmK1SEjY_rKBGAVMZPUZwriSX4M&start_radio=1&ab_channel=Slipknot',
    titulo: 'Titulo Titulo Titulo Titulo Titulo 2'
  },
  {
    id: '3',
    expFechas: '2007',
    image: 'https://swiperjs.com/demos/images/nature-3.jpg',
    link: 'https://www.youtube.com/watch?v=ZPUZwriSX4M&list=RDGMEMJQXQAmqrnmK1SEjY_rKBGAVMZPUZwriSX4M&start_radio=1&ab_channel=Slipknot',
    titulo: 'Titulo Titulo Titulo Titulo Titulo 3'
  },
  {
    id: '4',
    expFechas: '2008',
    image: 'https://swiperjs.com/demos/images/nature-4.jpg',
    link: 'https://www.youtube.com/watch?v=ZPUZwriSX4M&list=RDGMEMJQXQAmqrnmK1SEjY_rKBGAVMZPUZwriSX4M&start_radio=1&ab_channel=Slipknot',
    titulo: 'Titulo Titulo Titulo Titulo Titulo 4'
  },
  {
    id: '5',
    expFechas: '2009',
    image: 'https://swiperjs.com/demos/images/nature-5.jpg',
    link: 'https://www.youtube.com/watch?v=ZPUZwriSX4M&list=RDGMEMJQXQAmqrnmK1SEjY_rKBGAVMZPUZwriSX4M&start_radio=1&ab_channel=Slipknot',
    titulo: 'Titulo Titulo Titulo Titulo Titulo 5'
  },
  {
    id: '6',
    expFechas: '2010',
    image: 'https://swiperjs.com/demos/images/nature-6.jpg',
    link: 'https://www.youtube.com/watch?v=ZPUZwriSX4M&list=RDGMEMJQXQAmqrnmK1SEjY_rKBGAVMZPUZwriSX4M&start_radio=1&ab_channel=Slipknot',
    titulo: 'Titulo Titulo Titulo Titulo Titulo 6'
  },
  {
    id: '7',
    expFechas: '2011',
    image: 'https://swiperjs.com/demos/images/nature-7.jpg',
    link: 'https://www.youtube.com/watch?v=ZPUZwriSX4M&list=RDGMEMJQXQAmqrnmK1SEjY_rKBGAVMZPUZwriSX4M&start_radio=1&ab_channel=Slipknot',
    titulo: 'Titulo Titulo Titulo Titulo Titulo 7'
  },
  {
    id: '8',
    expFechas: '2012',
    image: 'https://swiperjs.com/demos/images/nature-8.jpg',
    link: 'https://www.youtube.com/watch?v=ZPUZwriSX4M&list=RDGMEMJQXQAmqrnmK1SEjY_rKBGAVMZPUZwriSX4M&start_radio=1&ab_channel=Slipknot',
    titulo: 'Titulo Titulo Titulo Titulo Titulo 8'
  },
  {
    id: '9',
    expFechas: '2013',
    image: 'https://swiperjs.com/demos/images/nature-9.jpg',
    link: 'https://www.youtube.com/watch?v=ZPUZwriSX4M&list=RDGMEMJQXQAmqrnmK1SEjY_rKBGAVMZPUZwriSX4M&start_radio=1&ab_channel=Slipknot',
    titulo: 'Titulo Titulo Titulo Titulo Titulo 9'
  }
];

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
                    <SwiperSlide className="rounded" key={index}>
                      <NoticiaCard
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
