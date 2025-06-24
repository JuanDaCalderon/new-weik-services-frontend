import {Row, Col, Button} from 'react-bootstrap';
import {InputField} from '@/components/Form2';

const ComentarioForm = () => {
  return (
    <Row className="d-flex">
      <Col className="pe-1">
        <InputField
          name="comentario"
          type="text"
          bottomMargin={0}
          placeholder="Escribe tu comentario..."
          as="textarea"
          rows={1}
        />
      </Col>
      <Col className="col-auto">
        <Button variant="danger">Enviar</Button>
      </Col>
    </Row>
  );
};

export default ComentarioForm;
