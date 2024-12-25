import {Form} from 'react-bootstrap';
import {ChangeEvent, Dispatch, memo, SetStateAction, useCallback} from 'react';
import {RolCreationBasics} from '@/types';

const BodyModal = memo(function BodyModal({
  formData,
  setFormData
}: {
  formData: RolCreationBasics;
  setFormData: Dispatch<SetStateAction<RolCreationBasics>>;
}) {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    },
    [setFormData]
  );

  return (
    <>
      <Form.Label className="text-dark cursor-pointer mb-0" htmlFor="rol">
        <strong>Nombre del Rol:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        type="text"
        id="rol"
        name="rol"
        placeholder="Ingresa el nombre del rol"
        value={formData.rol || ''}
        onChange={handleInputChange}
      />
      <Form.Label className="text-dark cursor-pointer mb-0 mt-1" htmlFor="descripcion">
        <strong>Descripción del Rol:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        as="textarea"
        rows={2}
        id="descripcion"
        name="descripcion"
        placeholder="Ingresa la descripción del rol"
        value={formData.descripcion || ''}
        maxLength={100}
        style={{resize: 'none'}}
        onChange={handleInputChange}
      />
      <span className="d-block p-0 m-0 font-12 text-danger w-100 text-end">
        {' '}
        El máximo permitido de caracteres para la descripción es 100.
      </span>
      <p className="p-0 mb-0 mt-1">
        Los permisos se pueden asignar manualmente posterior a la creación del rol, asi como asociar
        usuarios a este rol desde la ventana de 'Usuarios'.
      </p>
    </>
  );
});

export {BodyModal};
