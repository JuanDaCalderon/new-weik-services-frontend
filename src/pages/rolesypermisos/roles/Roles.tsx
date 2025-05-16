import {memo, useCallback, useMemo, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {Rol, RolCreationBasics, thisRol} from '@/types';
import {MemoizedRenderSubComponent} from './SubComponentPermisos';
import {rolesColumns} from './columnas';
import {GenericModal} from '@/components/Modals/GenericModal';
import {useToggle} from '@/hooks';
import useRoles from './useRoles';
import {BodyModal} from './CrearRolesBodyModal';
import {checkIfRolExists, hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import toast from 'react-hot-toast';

const Roles = memo(function Roles() {
  const {roles, sendRol, isLoadingCreatinRol, rolesFromStore} = useRoles();
  const [crearRolOpen, crearRolOpenToggle] = useToggle();
  const [isReadyToBeSend, setIsReadyToBeSend] = useState<boolean>(false);
  const [rolCreationBasics, setRolCreationBasics] = useState<RolCreationBasics>({});
  const user = useAppSelector(selectUser);

  const getPermission = useCallback(
    (permisoId: string) => {
      return hasPermission(permisoId, user.roles, user.permisosOtorgados, user.permisosDenegados);
    },
    [user.permisosDenegados, user.permisosOtorgados, user.roles]
  );

  const canCrearRol = useMemo(() => getPermission(PERMISOS_MAP_IDS.crearRoles), [getPermission]);
  const canEditRoles = useMemo(() => getPermission(PERMISOS_MAP_IDS.editarRoles), [getPermission]);

  const onSend = useCallback(async () => {
    const {rol, descripcion} = rolCreationBasics;
    if ([rol, descripcion].some((field) => !field?.trim())) {
      toast.error('Todos los campos son requeridos');
      setRolCreationBasics({});
      crearRolOpenToggle();
      return;
    }
    if (checkIfRolExists(rolCreationBasics as Rol, rolesFromStore)) {
      toast.error('No se pudo crear el rol, ya existe un registro con el mismo nombre o descripción');
      crearRolOpenToggle();
      return;
    }
    await sendRol(rolCreationBasics);
    setRolCreationBasics({});
    crearRolOpenToggle();
  }, [crearRolOpenToggle, rolCreationBasics, rolesFromStore, sendRol]);

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
        body={
          <BodyModal formData={rolCreationBasics} setFormData={setRolCreationBasics} isTouch={setIsReadyToBeSend} />
        }
        isDisabled={isLoadingCreatinRol || !isReadyToBeSend}
        isLoading={isLoadingCreatinRol}
        onSend={onSend}
      />
      <Row className="d-flex align-content-center align-items-center">
        <Col xs="auto" className="me-auto">
          <h4 className="header-title text-dark m-0">Gestor de roles</h4>
        </Col>
        <Col xs="auto" className="d-flex column-gap-1 justify-content-end align-items-center text-end ms-auto">
          {!canCrearRol && (
            <span className="m-0 p-0 text-danger font-11 text-end">
              Permiso para "crear rol" denegado. <br /> Contacta a tu administrador si lo necesitas.
            </span>
          )}
          <Button
            size="sm"
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
            searchBoxClass="mt-2"
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
