import {Row, Col, Button} from 'react-bootstrap';
import {InputField} from '@/components/Form2';
import {useCallback, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Registros} from '@/types';
import useUpdateComentarios from '@/endpoints/db/registros/useUpdateComentarios';
type props = {registro: Registros; registerType: string};
const ComentarioForm = ({registro, registerType}: props) => {
  const [comentario, setComentario] = useState<string>('');
  const {cliente} = useParams<{cliente: string}>();
  const {isUpdatingComentario, updateComentariosPerClienteType} = useUpdateComentarios();

  const onSendComment = useCallback(async () => {
    if (!cliente) return;
    if (!comentario.trim()) return;
    await updateComentariosPerClienteType(cliente, registerType, registro.id, comentario);
    setComentario('');
  }, [cliente, comentario, registerType, registro.id, updateComentariosPerClienteType]);

  return (
    <Row className="d-flex justify-content-between align-items-center align-content-center gap-2">
      <Col className="pe-0">
        <InputField
          name="comentario"
          type="text"
          rows={1}
          as="textarea"
          bottomMargin={0}
          placeholder="Escribe tu comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
      </Col>
      <Col xs="auto" className="d-flex justify-content-end ps-0">
        <Button variant="danger" onClick={onSendComment} disabled={!comentario.trim() || isUpdatingComentario}>
          Comentar
        </Button>
      </Col>
    </Row>
  );
};

export default ComentarioForm;
