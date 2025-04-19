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
  deleteText,
  body,
  onSend,
  onDelete,
  isDisabled,
  isLoading,
  showFooter = true,
  showDeleteButton = false,
  size = undefined
}: ModalProps) {
  return (
    <Modal show={show} onHide={onToggle} size={size}>
      <Modal.Header onHide={onToggle} closeButton className={`${variant ? 'modal-colored-header bg-' + variant : ''}`}>
        <Modal.Title className={`${variant !== undefined ? 'text-light' : ''}`}>{headerText || 'Header'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      {showFooter && (
        <Modal.Footer>
          {showDeleteButton && (
            <Button className="shadow-sm me-auto" variant="danger" onClick={onDelete} disabled={isDisabled}>
              {isLoading && <Spinner className="spinner-border-sm" tag="span" color="white" />}
              {!isLoading && (deleteText || 'Eliminar')}
            </Button>
          )}
          <Button className="shadow-sm" variant="light" onClick={onToggle} disabled={isDisabled}>
            {isLoading && <Spinner className="spinner-border-sm" tag="span" color="white" />}
            {!isLoading && (secondaryText || 'Cerrar')}
          </Button>
          <Button className="shadow-sm" variant={variant || 'primary'} onClick={onSend} disabled={isDisabled}>
            {isLoading && <Spinner className="spinner-border-sm" tag="span" color="white" />}
            {!isLoading && (submitText || 'Guardar cambios')}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
});

export {GenericModal};
