import {Dispatch, memo, SetStateAction, useCallback, ChangeEvent} from 'react';
import {InputField} from '@/components/Form2';
import {Objetivos} from '@/types';
import {Form, Row} from 'react-bootstrap';
import {DatepickerRange} from '@/components';

type CrearObjetivoProps = {
  nuevoObjetivo: Partial<Objetivos>;
  setNuevoObjetivo: Dispatch<SetStateAction<Partial<Objetivos>>>;
  setHasTouched: Dispatch<SetStateAction<boolean>>;
  dateRange: [Date | null, Date | null];
  onDateChangeRange: (dates: any) => void;
};

const CrearObjetivo = memo(function CrearObjetivo({
  nuevoObjetivo,
  setNuevoObjetivo,
  setHasTouched,
  dateRange,
  onDateChangeRange
}: CrearObjetivoProps) {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setHasTouched(true);
      setNuevoObjetivo((prev) => ({...prev, [name]: value}));
    },
    [setHasTouched, setNuevoObjetivo]
  );
  return (
    <Row>
      <InputField
        xs={12}
        label="Título del Objetivo"
        type="text"
        name="titulo"
        value={nuevoObjetivo.titulo || ''}
        onChange={handleInputChange}
      />
      <InputField
        xs={12}
        label="Descripción del Objetivo"
        as="textarea"
        rows={4}
        type="text"
        name="descripcion"
        value={nuevoObjetivo.descripcion || ''}
        onChange={handleInputChange}
      />
      <Form.Label className="mb-1" htmlFor="rangoFechas">
        <strong>Rango de fechas para realizar este objetivo</strong>
      </Form.Label>
      <DatepickerRange
        dateFormat="MMMM d, yyyy"
        isRange={true}
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        onChange={onDateChangeRange}
      />
    </Row>
  );
});

export {CrearObjetivo};
