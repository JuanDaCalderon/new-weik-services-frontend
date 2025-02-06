import {PageBreadcrumb} from '@/components';
import ReactTable from '@/components/table/ReactTable';
import {memo, useEffect, useMemo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {columns} from './Columnas';
import {Employee} from '@/types';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {Toaster} from 'react-hot-toast';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {CrearUsuarios} from '@/pages/gestion/usuarios/CrearUsuarios';
import {useGetEmployees} from '@/endpoints';
import {hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';
import {Navigate} from 'react-router-dom';

const Usuarios = memo(function Usuarios() {
  const user = useAppSelector(selectUser);
  const {getEmployeesSync} = useGetEmployees();
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  const canCrearUsuarios = useMemo(() => {
    return hasPermission(
      PERMISOS_MAP_IDS.crearUsuario,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  if (
    !hasPermission(
      PERMISOS_MAP_IDS.accesoGestionUsuarios,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    )
  ) {
    return <Navigate to="/services/dashboard" replace />;
  }

  return (
    <>
      <PageBreadcrumb title="Gestión usuarios" />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                {canCrearUsuarios ? (
                  <>
                    <Col sm={12} lg={4} xl={3} className="mb-3 mb-lg-0">
                      {!isLoadingUsers ? (
                        <CrearUsuarios />
                      ) : (
                        <SkeletonLoader height="300px" customClass="p-0" />
                      )}
                    </Col>
                    <Col sm={12} lg={8} xl={9}>
                      <h4 className="header-title text-dark text-opacity-75 m-0 ms-1">Usuarios</h4>
                      {!isLoadingUsers ? (
                        <ReactTable<Employee>
                          columns={columns}
                          data={users}
                          pageSize={10}
                          tableClass="table-striped"
                          showPagination
                        />
                      ) : (
                        <SkeletonLoader height="100%" customClass="px-0" />
                      )}
                    </Col>
                  </>
                ) : (
                  <Col sm={12}>
                    <h4 className="header-title text-dark text-opacity-75 m-0 ms-1">Usuarios</h4>
                    {!isLoadingUsers ? (
                      <ReactTable<Employee>
                        columns={columns}
                        data={users}
                        pageSize={10}
                        tableClass="table-striped"
                        showPagination
                      />
                    ) : (
                      <SkeletonLoader height="100%" customClass="px-0" />
                    )}
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
});

export {Usuarios};
