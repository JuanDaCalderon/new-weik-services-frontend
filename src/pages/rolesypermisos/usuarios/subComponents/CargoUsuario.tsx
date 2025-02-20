import {Spinner} from '@/components';
import {useUpdateUser} from '@/endpoints';
import {thisUsuarios, UsuarioCargoEdit} from '@/types';
import {getNombreCompletoUser, getUpdatedFields} from '@/utils';
import {Row as RowTable} from '@tanstack/react-table';
import {ChangeEvent, memo, useCallback, useMemo, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import toast from 'react-hot-toast';

const CargoUsuario = memo(function CargoUsuario({row}: {row: RowTable<thisUsuarios>}) {
  const userCargoInicial: UsuarioCargoEdit = useMemo((): UsuarioCargoEdit => {
    return {
      cargo: row.original?.cargo ?? ''
    };
  }, [row.original?.cargo]);
  const [userCargo, setUserCargo] = useState<UsuarioCargoEdit>(userCargoInicial);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const {isLoadingUpdateCargo, updateUserCargo} = useUpdateUser();

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setUserCargo((prev) => ({
      ...prev,
      [name]: value
    }));
    setHasTouched(true);
  }, []);

  const enviarRolBasics = useCallback(async () => {
    const userCargoUpdated = getUpdatedFields<UsuarioCargoEdit>(userCargoInicial, userCargo);
    if (Object.keys(userCargoUpdated).length > 0) {
      await updateUserCargo(String(row.original.id), userCargoUpdated);
    } else {
      toast.error('No se han realizado cambios');
      setHasTouched(false);
    }
  }, [row.original.id, updateUserCargo, userCargo, userCargoInicial]);

  return (
    <Row className="m-0 py-2 column-gap-1 bg-light-subtle">
      <span>
        <i className="mdi mdi-arrow-up-left-bold font-16" />
        <strong>Cargo del usuario {getNombreCompletoUser(row.original)}</strong>
      </span>
      <p className="my-0 py-0">Edita el cargo del usuario utilizando el campo a continuación y guarda los cambios.</p>
      <Col className="mt-1" lg={12}>
        <Form.Label className="mb-0" htmlFor="cargo">
          <strong>Cargo:</strong>
        </Form.Label>
        <Form.Control
          size="sm"
          type="text"
          id="cargo"
          name="cargo"
          placeholder="Ingresa el cargo de este usuario"
          value={userCargo.cargo}
          onChange={handleInputChange}
        />
      </Col>
      <Col xs="auto" md={12} className="ms-auto mt-2">
        <Button className="shadow-sm" variant="info" disabled={!hasTouched} onClick={enviarRolBasics}>
          {isLoadingUpdateCargo && <Spinner className="spinner-border-sm" tag="span" color="white" />}
          {!isLoadingUpdateCargo && 'Guardar cambios'}
        </Button>
      </Col>
    </Row>
  );
});

export {CargoUsuario};
