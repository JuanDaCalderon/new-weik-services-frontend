import {ModalProps} from '@/types';
import {memo} from 'react';
import {Button, Modal} from 'react-bootstrap';
import Spinner from '../Spinner';

const GenericModal = memo(function GenericModal({
  show,
  onToggle,
  variant,
  headerText,
  submitText,
  secondaryText,
  body,
  onSend,
  isDisabled,
  isLoading
}: ModalProps) {
  return (
    <Modal show={show} onHide={onToggle}>
      <Modal.Header
        onHide={onToggle}
        closeButton
        className={`${variant ? 'modal-colored-header bg-' + variant : ''}`}>
        <Modal.Title className={`${variant ? 'text-light' : ''}`}>
          {headerText || 'Header'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button className="shadow-sm" variant="light" onClick={onToggle}>
          {secondaryText || 'Cerrar'}
        </Button>
        <Button
          className="shadow-sm"
          variant={variant || 'primary'}
          onClick={onSend}
          disabled={isDisabled}>
          {isLoading && <Spinner className="spinner-border-sm" tag="span" color="white" />}
          {!isLoading && (submitText || 'Guardar cambios')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export {GenericModal};
