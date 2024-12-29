import {thisRol} from '@/types';
import Select, {MultiValue} from 'react-select';
import {Row as RowTable} from '@tanstack/react-table';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {useAppSelector} from '@/store';
import {selectEmployees} from '@/store/selectores/users';
import {getUserNameUser} from '@/utils';
import toast from 'react-hot-toast';
import {useRolesYPermisos} from '@/endpoints';
import {Spinner} from '@/components';

const UsuariosEnRoles = memo(function PermisosEnRoles({row}: {row: RowTable<thisRol>}) {
  const [selectedOptions, setSelectedOptions] = useState<{value: string; label: string}[]>([]);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const employees = useAppSelector(selectEmployees);
  const {addRolToUser, removeRolToUser, isLoadingAddAndRemoveRolToUser} = useRolesYPermisos();
  const usuariosIniciales = useMemo(() => {
    return (row.original.usuarios || []).map<{value: string; label: string}>((employee) => {
      return {
        value: employee.id,
        label: getUserNameUser(employee)
      };
    });
  }, [row.original.usuarios]);

  useEffect(() => {
    setSelectedOptions(usuariosIniciales);
  }, [usuariosIniciales]);

  const options = useMemo(() => {
    return employees.map((employee) => {
      return {
        value: employee.id,
        label: getUserNameUser(employee)
      };
    });
  }, [employees]);

  const handleSelectChange = useCallback((selected: MultiValue<{value: string; label: string}>) => {
    setSelectedOptions(selected as {value: string; label: string}[]);
    setHasTouched(true);
  }, []);

  const handleSave = useCallback(async () => {
    const initialValues = new Set(usuariosIniciales.map((user) => user.value));
    const selectedValues = new Set(selectedOptions.map((user) => user.value));
    const addedUsers = Array.from(selectedValues).filter((value) => !initialValues.has(value));
    const removedUsers = Array.from(initialValues).filter((value) => !selectedValues.has(value));
    if (addedUsers.length > 0 || removedUsers.length > 0) {
      if (removedUsers.length > 0) await removeRolToUser(String(row.original.id), removedUsers);
      if (addedUsers.length > 0) await addRolToUser(String(row.original.id), addedUsers);
    } else {
      toast.error('No se han realizado cambios');
      setHasTouched(false);
    }
  }, [addRolToUser, removeRolToUser, row.original.id, selectedOptions, usuariosIniciales]);

  return (
    <Row className="m-0 py-2 column-gap-1 bg-light-subtle">
      <span>
        <i className="mdi mdi-arrow-up-left-bold font-16" />
        <strong>Usuarios del rol {row.original.rolName}</strong>
      </span>
      <p className="my-0 py-0">
        Asigna usuarios a este rol utilizando el selector que se muestra a continuación. Agrega o
        elimina según sea necesario y guarda los cambios.
      </p>
      <Col className="mt-1" lg={12}>
        <Form.Label className="mb-0" htmlFor="cargo">
          <strong>Usuarios:</strong>
        </Form.Label>
        <Select
          isMulti={true}
          options={options}
          value={selectedOptions}
          onChange={handleSelectChange}
          className="react-select"
          classNamePrefix="react-select"
          placeholder="No hay usuarios asignados"
        />
      </Col>
      <Col xs="auto" md={12} className="ms-auto mt-2">
        <Button className="shadow-sm" variant="info" onClick={handleSave} disabled={!hasTouched}>
          {isLoadingAddAndRemoveRolToUser && (
            <Spinner className="spinner-border-sm" tag="span" color="white" />
          )}
          {!isLoadingAddAndRemoveRolToUser && 'Guardar cambios'}
        </Button>
      </Col>
    </Row>
  );
});

export {UsuariosEnRoles};
