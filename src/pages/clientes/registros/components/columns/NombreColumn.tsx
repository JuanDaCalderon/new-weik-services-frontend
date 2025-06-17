import {memo, useCallback, useState} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';
import {Form} from 'react-bootstrap';

const NombreColumn = memo(function NombreColumn({row}: {row: TableRow<Registros>}) {
  const [disabledHover, setDisabledHover] = useState<boolean>(true);
  const [isAlreadyEnter, setIsAlreadyEnter] = useState<boolean>(false);
  const [nombre, setNombre] = useState<string>(row.original.nombre);

  const handleUpdate = (e: any) => {
    console.log('🚀 ~ handleUpdate ~ e.target.name, e.target.value:', e.target.name, e.target.value);
  };

  const onMouseEnter = useCallback(() => {
    setDisabledHover(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    setDisabledHover(true);
  }, []);

  return (
    <>
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onBlurCapture={onMouseLeave}>
        <Form.Control
          type="text"
          value={nombre}
          name="nombre"
          disabled={disabledHover}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDownCapture={(e) => {
            if (e.key === 'Enter') {
              setIsAlreadyEnter(true);
              handleUpdate(e);
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
    </>
  );
});

export default NombreColumn;
