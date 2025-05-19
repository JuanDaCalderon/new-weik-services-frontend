import {Dispatch, memo, SetStateAction, useCallback, ChangeEvent} from 'react';
import {InputField, StarRating} from '@/components/Form2';
import {Evaluation} from '@/types';
import {Col, Form, Row} from 'react-bootstrap';

type EvaluarObjetivoProps = {
  evaluacion: Partial<Evaluation>;
  setEvaluacion: Dispatch<SetStateAction<Partial<Evaluation>>>;
  setHasTouched: Dispatch<SetStateAction<boolean>>;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  setRating: Dispatch<SetStateAction<0 | 1 | 2 | 3 | 4 | 5>>;
  isDisabledInput?: boolean;
};

const EvaluarObjetivo = memo(function EvaluarObjetivo({
  evaluacion,
  setEvaluacion,
  setHasTouched,
  rating,
  setRating,
  isDisabledInput = false
}: EvaluarObjetivoProps) {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setHasTouched(true);
      setEvaluacion((prev) => ({...prev, [name]: value}));
    },
    [setEvaluacion, setHasTouched]
  );
  return (
    <Row>
      <Col xs={12}>
        <Form.Label className="mb-0">
          <strong>Estrellas</strong>
        </Form.Label>
        <StarRating
          value={rating}
          onChange={(star) => {
            setHasTouched(true);
            setRating(star);
          }}
          disabled={isDisabledInput}
        />
      </Col>
      <InputField
        xs={12}
        label="Retroalimentación"
        placeholder="Escribe aquí tu retroalimentación"
        as="textarea"
        rows={4}
        type="text"
        name="feedback"
        disabled={isDisabledInput}
        value={evaluacion.feedback || ''}
        onChange={handleInputChange}
      />
    </Row>
  );
});

export {EvaluarObjetivo};
