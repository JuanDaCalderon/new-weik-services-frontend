import {memo, useCallback, useMemo} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {MemoizedRenderSubComponent} from './SubComponentUsuarios';
import {thisUsuarios} from '@/types';
import useUsuarios from './useUsuarios';
import {usuariosColumns} from './columnas';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {hasPermission} from '@/utils';
import {GESTION_USUARIOS_ROUTER_PATH, PERMISOS_MAP_IDS} from '@/constants';
import {useNavigate} from 'react-router-dom';

const Usuarios = memo(function Usuarios() {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const {usuarios} = useUsuarios();
  const canCrearUsuario = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearUsuarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);
  const canEditUsuarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.editarUsuarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);
  const onNavigateToCrearUsuario = useCallback(() => {
    navigate(GESTION_USUARIOS_ROUTER_PATH);
  }, [navigate]);

  return (
    <>
      <hr className="d-md-none" />
      <Row className="d-flex align-content-center align-items-center">
        <Col xs="auto" className="me-auto mb-2 mb-md-0">
          <h4 className="header-title text-dark m-0">Gestión de permisos por usuarios</h4>
        </Col>
        <Col xs="auto" className="d-flex column-gap-1 justify-content-end align-items-center text-end ms-auto">
          {!canCrearUsuario && (
            <span className="m-0 p-0 text-danger font-11 text-end">
              Permiso para "crear usuario" denegado. <br /> Contacta a tu administrador si lo necesitas.
            </span>
          )}
          <Button
            className="shadow-sm"
            style={{maxWidth: '175px'}}
            variant="success"
            disabled={!canCrearUsuario}
            onClick={onNavigateToCrearUsuario}>
            <i className="mdi mdi-account-multiple-plus me-1" />
            Crear Usuario
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <ReactTable<thisUsuarios>
            theadClass="table-light"
            searchBoxClass="mt-2"
            columns={usuariosColumns}
            data={usuarios}
            showPagination
            isSearchable={true}
            getRowCanExpand={() => canEditUsuarios}
            renderSubComponent={(props) => <MemoizedRenderSubComponent {...props} />}
          />
          {!canEditUsuarios && (
            <div className="w-100 text-end mt-1">
              <span className="m-0 p-0 text-danger font-11 text-end">
                Permiso para "editar usuarios" denegado. Contacta a tu administrador si lo necesitas.
              </span>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
});

export {Usuarios};
