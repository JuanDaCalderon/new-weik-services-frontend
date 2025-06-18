import {memo, useCallback, useState, ChangeEvent, KeyboardEvent, MouseEvent} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';
import {Form} from 'react-bootstrap';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

const NombreColumn = memo(function NombreColumn({row}: {row: TableRow<Registros>}) {
  const [nombre, setNombre] = useState<string>(row.original.nombre);
  const [disabledHover, setDisabledHover] = useState<boolean>(true);
  const [isAlreadyEnter, setIsAlreadyEnter] = useState<boolean>(false);
  const handleUpdate = useCallback(
    (e: ChangeEvent<FormControlElement> | KeyboardEvent<FormControlElement> | MouseEvent<FormControlElement>) => {
      const target = e.target as FormControlElement;
      console.log('🚀 ~ handleUpdate ~ target.name, target.value:', target.name, target.value);
    },
    []
  );
  const onMouseEnter = useCallback(() => setDisabledHover(false), []);
  const onMouseLeave = useCallback(() => setDisabledHover(true), []);
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onBlurCapture={onMouseLeave}>
      <Form.Control
        type="text"
        value={nombre}
        name="nombre"
        disabled={disabledHover}
        onChange={(e) => setNombre(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            setIsAlreadyEnter(true);
            handleUpdate(e);
          } else if (e.key === 'Escape') {
            setNombre(row.original.nombre);
            setIsAlreadyEnter(false);
          }
        }}
        onMouseLeave={(e) => {
          if (!isAlreadyEnter) handleUpdate(e);
          else setIsAlreadyEnter(false);
        }}
        onBlurCapture={(e) => {
          if (!isAlreadyEnter) handleUpdate(e);
          else setIsAlreadyEnter(false);
        }}
      />
    </div>
  );
});

export default NombreColumn;
