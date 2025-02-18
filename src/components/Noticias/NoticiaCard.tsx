import {memo, useCallback, MouseEvent, useState, useEffect} from 'react';
import {Card, OverlayTrigger, Tooltip, Image} from 'react-bootstrap';
import {truncateString} from '@/utils';
import {GenericModal} from '@/components/Modals/GenericModal';
import {useTogglev2} from '@/hooks';
import {SkeletonLoader} from '@/components/SkeletonLoader';

type NoticiaCardProps = {
  isExpanded: boolean;
  fechaExp: string;
  noticiaImg: string;
  titulo: string;
  link: string;
};

const NoticiaCard = memo(function NoticiaCard({
  isExpanded,
  fechaExp,
  noticiaImg,
  titulo,
  link
}: NoticiaCardProps) {
  const [boardImageHasLoad, setBoardImageHasLoad] = useState<boolean>(false);
  const [modalImageHasLoad, setModalImageHasLoad] = useState<boolean>(false);
  const {isOpen, toggle, show} = useTogglev2();

  useEffect(() => {
    if (isOpen === false && modalImageHasLoad !== false) setModalImageHasLoad(false);
  }, [isOpen, modalImageHasLoad]);

  const onExpandImage = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      show();
    },
    [show]
  );

  const boardImageOnLoad = useCallback(() => {
    setBoardImageHasLoad(true);
  }, []);

  const modalImageOnLoad = useCallback(() => {
    setModalImageHasLoad(true);
  }, []);

  return (
    <>
      <GenericModal
        show={isOpen}
        onToggle={toggle}
        variant="info"
        headerText={titulo}
        showFooter={false}
        body={
          <>
            <div style={{width: '100%', aspectRatio: '1/1', position: 'relative'}}>
              {!modalImageHasLoad && (
                <SkeletonLoader customClass="p-0 m-0 position-absolute top-0 start-0 rounded" />
              )}
              <Image
                src={noticiaImg}
                alt="Descripción de la imagen"
                fluid
                loading="lazy"
                className="rounded"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                onLoad={modalImageOnLoad}
              />
            </div>
          </>
        }
      />
      <Card className="p-0 m-0 w-100 h-100 rounded">
        <Card.Body className="p-0 m-0 w-100 h-100 position-relative rounded">
          {isExpanded && (
            <OverlayTrigger placement="auto" overlay={<Tooltip>{fechaExp}</Tooltip>}>
              <i
                className="d-flex justify-content-center align-items-center uil-info-circle position-absolute font-18 bg-light rounded-5 m-1 cursor-pointer bg-opacity-75"
                style={{width: '24px', height: '24px'}}
              />
            </OverlayTrigger>
          )}
          <a href="#" role="button" onClick={onExpandImage} className="rounded">
            {!boardImageHasLoad && (
              <SkeletonLoader customClass="p-0 m-0 position-absolute rounded" />
            )}
            <Image
              src={noticiaImg}
              alt={noticiaImg}
              fluid
              loading="lazy"
              className="w-100 h-100 object-fit-cover rounded"
              onLoad={boardImageOnLoad}
            />
          </a>
          <div className="d-flex justify-content-between align-items-center p-1 position-absolute w-100 bottom-0 bg-gradient bg-light bg-opacity-50">
            <h5 className={`m-0 text-dark text-opacity-75 font-${isExpanded ? '14' : '12'}`}>
              {isExpanded ? <>{titulo}</> : <>{truncateString(titulo, 23)}</>}
            </h5>
            {isExpanded && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark btn-sm btn-rounded py-0 px-1 m-0">
                <i className="uil-external-link-alt"></i>
              </a>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
});

export {NoticiaCard};
