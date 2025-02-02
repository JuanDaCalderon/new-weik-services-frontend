import {PageBreadcrumb} from '@/components';
import ReactTable from '@/components/table/ReactTable';
import {memo, useEffect} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {columns} from './Columnas';
import {Employee} from '@/types';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees} from '@/store/selectores';
import {Toaster} from 'react-hot-toast';
import {SkeletonLoader} from '@/components/SkeletonLoader';
/* import {CrearUsuarios} from '@/pages/gestion/usuarios/CrearUsuarios'; */
import {useGetEmployees} from '@/endpoints';

const Usuarios = memo(function Usuarios() {
  const {getEmployeesSync} = useGetEmployees();
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);

  useEffect(() => {
    if (users.length <= 0) {
      getEmployeesSync();
    }
  }, [getEmployeesSync, users.length]);

  return (
    <>
      <PageBreadcrumb title="Gestión usuarios" />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col sm={12} lg={4} xl={3} xxl={2} className="mb-3 mb-lg-0">
                  {/* <CrearUsuarios /> */}
                </Col>
                <Col sm={12} lg={8} xl={9} xxl={10}>
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
                    <SkeletonLoader height="200px" customClass="px-1" />
                  )}
                </Col>
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
