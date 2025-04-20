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
  onClose = () => {},
  isDisabled,
  isLoading,
  showFooter = true,
  showDeleteButton = false,
  showSendButton = true,
  size = undefined
}: ModalProps) {
  return (
    <Modal
      show={show}
      onHide={() => {
        onClose();
        onToggle();
      }}
      size={size}>
      <Modal.Header
        onHide={() => {
          onClose();
          onToggle();
        }}
        closeButton
        className={`${variant ? 'modal-colored-header bg-' + variant : ''}`}>
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
          <Button
            className="shadow-sm"
            variant="light"
            onClick={() => {
              onClose();
              onToggle();
            }}>
            {isLoading && <Spinner className="spinner-border-sm" tag="span" color="white" />}
            {!isLoading && (secondaryText || 'Cerrar')}
          </Button>
          {showSendButton && (
            <Button className="shadow-sm" variant={variant || 'primary'} onClick={onSend} disabled={isDisabled}>
              {isLoading && <Spinner className="spinner-border-sm" tag="span" color="white" />}
              {!isLoading && (submitText || 'Guardar cambios')}
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
});

export {GenericModal};
