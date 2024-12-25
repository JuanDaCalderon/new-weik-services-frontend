import {memo, useCallback, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {RolCreationBasics, thisRol} from '@/types';
import {MemoizedRenderSubComponent} from './SubComponentPermisos';
import {rolesColumns} from './columnas';
import {GenericModal} from '@/components/Modals/GenericModal';
import {useToggle} from '@/hooks';
import useRoles from './useRoles';
import {BodyModal} from './CrearRolesBodyModal';

const Roles = memo(function Roles() {
  const {roles, sendRol, isLoadingCreatinRol} = useRoles();
  const [crearRolOpen, crearRolOpenToggle] = useToggle();
  const [rolCreationBasics, setRolCreationBasics] = useState<RolCreationBasics>({});

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
        <Col xs="auto" className="ms-auto">
          <Button className="w-100 shadow-sm" variant="success" onClick={crearRolOpenToggle}>
            <i className="mdi mdi-account-cog" /> Crear Rol
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
            getRowCanExpand={() => true}
            renderSubComponent={(props) => <MemoizedRenderSubComponent {...props} />}
          />
        </Col>
      </Row>
    </>
  );
});

export {Roles};
