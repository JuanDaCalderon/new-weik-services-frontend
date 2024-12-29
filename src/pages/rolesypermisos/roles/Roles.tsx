import {memo, useCallback, useMemo, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {RolCreationBasics, thisRol} from '@/types';
import {MemoizedRenderSubComponent} from './SubComponentPermisos';
import {rolesColumns} from './columnas';
import {GenericModal} from '@/components/Modals/GenericModal';
import {useToggle} from '@/hooks';
import useRoles from './useRoles';
import {BodyModal} from './CrearRolesBodyModal';
import {hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

const Roles = memo(function Roles() {
  const {roles, sendRol, isLoadingCreatinRol} = useRoles();
  const [crearRolOpen, crearRolOpenToggle] = useToggle();
  const [rolCreationBasics, setRolCreationBasics] = useState<RolCreationBasics>({});
  const user = useAppSelector(selectUser);

  const canCrearRol = useMemo(() => {
    return hasPermission(
      PERMISOS_MAP_IDS.crearRoles,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canEditRoles = useMemo(() => {
    return hasPermission(
      PERMISOS_MAP_IDS.editarRoles,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const onSend = useCallback(async () => {
    await sendRol(rolCreationBasics);
    setRolCreationBasics({});
  }, [rolCreationBasics, sendRol]);

  return (
    <>
      <hr className="d-md-none" />
      <GenericModal
        show={crearRolOpen}
        onToggle={crearRolOpenToggle}
        variant="success"
        headerText="Crear Rol"
        submitText="Crear"
        secondaryText="Cerrar"
        body={<BodyModal formData={rolCreationBasics} setFormData={setRolCreationBasics} />}
        isDisabled={isLoadingCreatinRol}
        isLoading={isLoadingCreatinRol}
        onSend={onSend}
      />
      <Row className="d-flex align-content-center align-items-center">
        <Col xs="auto" className="me-auto">
          <h4 className="header-title text-dark m-0">Gestor de roles</h4>
        </Col>
        <Col
          xs="auto"
          className="d-flex column-gap-1 justify-content-end align-items-center text-end ms-auto">
          {!canCrearRol && (
            <span className="m-0 p-0 text-danger font-11 text-end">
              Permiso para "crear rol" denegado. <br /> Contacta a tu administrador si lo necesitas.
            </span>
          )}
          <Button
            className="shadow-sm"
            style={{maxWidth: '175px'}}
            variant="success"
            disabled={!canCrearRol}
            onClick={crearRolOpenToggle}>
            <i className="mdi mdi-account-cog me-1" /> Crear Rol
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <ReactTable<thisRol>
            theadClass="table-light"
            searchBoxClass="my-2"
            columns={rolesColumns}
            data={roles}
            showPagination
            isSearchable={true}
            getRowCanExpand={() => canEditRoles}
            renderSubComponent={(props) => <MemoizedRenderSubComponent {...props} />}
          />
          {!canEditRoles && (
            <div className="w-100 text-end mt-1">
              <span className="m-0 p-0 text-danger font-11 text-end">
                Permiso para "editar roles" denegado. Contacta a tu administrador si lo necesitas.
              </span>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
});

export {Roles};
