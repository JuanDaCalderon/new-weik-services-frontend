import {thisUsuarios} from '@/types';
import Select, {MultiValue} from 'react-select';
import {Row as RowTable} from '@tanstack/react-table';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {useAppSelector} from '@/store';
import {getNombreCompletoUser} from '@/utils';
import toast from 'react-hot-toast';
import {Spinner} from '@/components';
import {rolesSelector} from '@/store/selectores';
import {useUpdateUser} from '@/endpoints';

const RoleEnUsuario = memo(function RoleEnUsuario({row}: {row: RowTable<thisUsuarios>}) {
  const [selectedOptions, setSelectedOptions] = useState<{value: string; label: string}[]>([]);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const roles = useAppSelector(rolesSelector);
  const rolesIniciales = useMemo(() => {
    return (row.original.roles || []).map<{value: string; label: string}>((rol) => {
      return {
        value: rol.id,
        label: rol.rol
      };
    });
  }, [row.original.roles]);
  const {updatedRolesOfUser, isLoadingUsersToRol} = useUpdateUser();

  useEffect(() => {
    setSelectedOptions(rolesIniciales);
  }, [rolesIniciales]);

  const options = useMemo(() => {
    return roles.map((rol) => {
      return {
        value: rol.id,
        label: rol.rol
      };
    });
  }, [roles]);

  const handleSelectChange = useCallback((selected: MultiValue<{value: string; label: string}>) => {
    setSelectedOptions(selected as {value: string; label: string}[]);
    setHasTouched(true);
  }, []);

  const handleSave = useCallback(async () => {
    const initialValues = new Set(rolesIniciales.map((rol) => rol.value));
    const selectedValues = new Set(selectedOptions.map((rol) => rol.value));
    const updatedRoles = Array.from(selectedValues);
    const addedRoles = updatedRoles.filter((value) => !initialValues.has(value));
    const removedRoles = Array.from(initialValues).filter((value) => !selectedValues.has(value));
    if (addedRoles.length > 0 || removedRoles.length > 0) {
      await updatedRolesOfUser(String(row.original.id), updatedRoles);
    } else {
      toast.error('No se han realizado cambios');
      setHasTouched(false);
    }
  }, [rolesIniciales, row.original.id, selectedOptions, updatedRolesOfUser]);

  const menuOpen = useCallback(() => {
    const tables = document.querySelectorAll('.table-responsive');
    for (const table of tables) {
      table.classList.add('overflow-unset');
    }
  }, []);

  const menuClose = useCallback(() => {
    const tables = document.querySelectorAll('.table-responsive');
    for (const table of tables) {
      table.classList.remove('overflow-unset');
    }
  }, []);

  return (
    <Row className="m-0 py-2 column-gap-1 bg-light-subtle">
      <span>
        <i className="mdi mdi-arrow-up-left-bold font-16" />
        <strong>Roles del usuario {getNombreCompletoUser(row.original)}</strong>
      </span>
      <p className="my-0 py-0">
        Asigna roles a este usuario utilizando el selector que se muestra a continuación. Agrega o elimina según sea
        necesario y guarda los cambios.
      </p>
      <Col className="mt-1" lg={12}>
        <Form.Label className="mb-0" htmlFor="cargo">
          <strong>Roles:</strong>
        </Form.Label>
        <Select
          isMulti={true}
          options={options}
          value={selectedOptions}
          onChange={handleSelectChange}
          className="react-select"
          classNamePrefix="react-select"
          placeholder="No hay roles asignados"
          onMenuOpen={menuOpen}
          onMenuClose={menuClose}
        />
      </Col>
      <Col xs="auto" md={12} className="ms-auto mt-2">
        <Button className="shadow-sm" variant="info" onClick={handleSave} disabled={!hasTouched}>
          {isLoadingUsersToRol && <Spinner className="spinner-border-sm" tag="span" color="white" />}
          {!isLoadingUsersToRol && 'Guardar cambios'}
        </Button>
      </Col>
    </Row>
  );
});

export {RoleEnUsuario};
