import {Dispatch, memo, SetStateAction, useCallback, ChangeEvent} from 'react';
import {InputField, StarRating} from '@/components/Form2';
import {SelfAssessment} from '@/types';
import {Col, Form, Row} from 'react-bootstrap';

type AutoEvaluarProps = {
  evaluacion: Partial<SelfAssessment>;
  setEvaluacion: Dispatch<SetStateAction<Partial<SelfAssessment>>>;
  setHasTouched: Dispatch<SetStateAction<boolean>>;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  setRating: Dispatch<SetStateAction<0 | 1 | 2 | 3 | 4 | 5>>;
  isDisabledInput?: boolean;
};

const AutoEvaluar = memo(function AutoEvaluar({
  evaluacion,
  setEvaluacion,
  setHasTouched,
  rating,
  setRating,
  isDisabledInput = false
}: AutoEvaluarProps) {
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
        label="Comentario"
        placeholder="Escribe aquí tu comentario"
        as="textarea"
        rows={4}
        type="text"
        name="comment"
        disabled={isDisabledInput}
        value={evaluacion.comment || ''}
        onChange={handleInputChange}
      />
    </Row>
  );
});

export {AutoEvaluar};
