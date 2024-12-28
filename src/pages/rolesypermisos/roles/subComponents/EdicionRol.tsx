import {Spinner} from '@/components';
import {useRolesYPermisos} from '@/endpoints';
import {RolCreationBasics, thisRol} from '@/types';
import {getUpdatedFields} from '@/utils';
import {Row as RowTable} from '@tanstack/react-table';
import {ChangeEvent, memo, useCallback, useMemo, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import toast from 'react-hot-toast';

const EdicionRol = memo(function EdicionRol({row}: {row: RowTable<thisRol>}) {
  const rolBasicsIniciales: RolCreationBasics = useMemo((): RolCreationBasics => {
    return {
      rol: row.original?.rolName ?? '',
      descripcion: row.original?.descripcion ?? ''
    };
  }, [row.original?.descripcion, row.original?.rolName]);
  const [rolEditedBasics, setRolEditedBasics] = useState<RolCreationBasics>(rolBasicsIniciales);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const {updateRolBasics, isLoadingUpdatingBasics} = useRolesYPermisos();

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setRolEditedBasics((prev) => ({
      ...prev,
      [name]: value
    }));
    setHasTouched(true);
  }, []);

  const enviarRolBasics = useCallback(async () => {
    const rolBasicsUpdated = getUpdatedFields<RolCreationBasics>(
      rolBasicsIniciales,
      rolEditedBasics
    );
    if (Object.keys(rolBasicsUpdated).length > 0) {
      await updateRolBasics(String(row.original.id), rolBasicsUpdated);
    } else {
      toast.error('No se han realizado cambios');
      setHasTouched(false);
    }
  }, [rolBasicsIniciales, rolEditedBasics, row.original.id, updateRolBasics]);

  return (
    <Row className="m-0 py-2 column-gap-1 bg-light-subtle">
      <span>
        <i className="mdi mdi-arrow-up-left-bold font-16" />
        <strong>Edición del rol {row.original.rolName}</strong>
      </span>
      <p className="my-0 py-0">
        Edita el nombre y la descripción del rol utilizando los campos a continuación, y guarda los
        cambios.
      </p>
      <Col className="mt-1" lg={12}>
        <Form.Label className="mb-0" htmlFor="rol">
          <strong>Nombre del Rol:</strong>
        </Form.Label>
        <Form.Control
          size="sm"
          type="text"
          id="rol"
          name="rol"
          placeholder="Ingresa el nombre del rol"
          value={rolEditedBasics.rol}
          onChange={handleInputChange}
        />
        <Form.Label className="mb-0 mt-1" htmlFor="descripcion">
          <strong>Descripción del Rol:</strong>
        </Form.Label>
        <Form.Control
          size="sm"
          as="textarea"
          rows={1}
          id="descripcion"
          name="descripcion"
          placeholder="Ingresa la descripción del rol"
          maxLength={100}
          style={{resize: 'none'}}
          value={rolEditedBasics.descripcion}
          onChange={handleInputChange}
        />
        <span className="d-block p-0 m-0 font-12 text-danger w-100 text-end">
          El máximo permitido de caracteres para la descripción es 100.
        </span>
      </Col>
      <Col xs="auto" md={12} className="ms-auto">
        <Button
          className="shadow-sm"
          variant="info"
          disabled={!hasTouched}
          onClick={enviarRolBasics}>
          {isLoadingUpdatingBasics && (
            <Spinner className="spinner-border-sm" tag="span" color="white" />
          )}
          {!isLoadingUpdatingBasics && 'Guardar cambios'}
        </Button>
      </Col>
    </Row>
  );
});

export {EdicionRol};
