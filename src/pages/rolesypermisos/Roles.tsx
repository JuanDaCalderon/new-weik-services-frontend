import {memo, useEffect, useMemo} from 'react';
import type {ColumnDef} from '@tanstack/react-table';
import {Badge, Button, Col, Row} from 'react-bootstrap';
import {Row as RowTable} from '@tanstack/react-table';
import ReactTable from '@/components/tablev02/ReactTable';
import {useRolesYPermisos} from '@/endpoints';
import {useAppSelector} from '@/store';
import {rolesSelector} from '@/store/selectores';
import {selectEmployees} from '@/store/selectores/users';
import {DateUtils} from '@/utils';

type thisRol = {
  id: number;
  rolName: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  RolePermisos: string;
  RoleUsuarios: string;
};

const columns: ColumnDef<thisRol>[] = [
  {
    header: 'Rol',
    accessorKey: 'rolName',
    cell: ({row}) => (
      <div
        className="cursor-pointer no-user-text-selectable scale-hover d-flex justify-content-start align-content-center align-items-center"
        onClick={row.getToggleExpandedHandler()}>
        <span className="d-block mb-1" style={{width: '20px', height: '20px'}}>
          {row.getIsExpanded() ? '👇' : '👉'}
        </span>
        <span className="d-block no-user-text-selectable fw-bold text-uppercase">
          {row.original.rolName}
        </span>
      </div>
    )
  },
  {
    header: 'Creado por',
    accessorKey: 'createdBy'
  },
  {
    header: 'Creado en',
    accessorKey: 'createdDate'
  },
  {
    header: 'Actualizado por',
    accessorKey: 'updatedBy'
  },
  {
    header: 'Actualizado en',
    accessorKey: 'updatedDate'
  },
  {
    header: 'Permisos del rol',
    accessorKey: 'RolePermisos',
    cell: ({row}) => (
      <Badge bg="" pill className="me-1 badge-outline-info font-14">
        {row.original.RolePermisos}
      </Badge>
    )
  },
  {
    header: 'Usuarios del rol',
    accessorKey: 'RoleUsuarios',
    cell: ({row}) => (
      <Badge bg="" pill className="me-1 badge-outline-warning font-14">
        {row.original.RoleUsuarios}
      </Badge>
    )
  }
];

const renderSubComponent = ({row}: {row: RowTable<thisRol>}) => {
  return (
    <pre style={{fontSize: '10px'}}>
      <code>{JSON.stringify(row.original, null, 2)}</code>
    </pre>
  );
};

const Roles = memo(function Roles() {
  const {getPermisosListener, getRolesListener} = useRolesYPermisos();
  const rolesFromStore = useAppSelector(rolesSelector);
  const employeesFromStore = useAppSelector(selectEmployees);

  useEffect(() => {
    const rolesUnsubscribe = getRolesListener();
    const permisosUnsubscribe = getPermisosListener();
    return () => {
      rolesUnsubscribe();
      permisosUnsubscribe();
    };
  }, [getPermisosListener, getRolesListener]);

  const roles: thisRol[] = useMemo(() => {
    return rolesFromStore.map<thisRol>((rol, index) => {
      const numeroRoles: number = rol.permisos.length;
      const numeroUsuarios: number = employeesFromStore.reduce((acc, employee) => {
        if (employee.roles.some((thisRol) => thisRol.id === rol.id)) return acc + 1;
        else return acc;
      }, 0);
      return {
        id: index + 1,
        rolName: rol.rol,
        createdBy: rol.usuarioCreacion.email,
        createdDate: DateUtils.formatShortDate(DateUtils.parseStringToDate(rol.fechaCreacion)),
        updatedBy: rol.usuarioUpdated.email,
        updatedDate: DateUtils.formatShortDate(
          DateUtils.parseStringToDate(rol.fechaActualizacion),
          true
        ),
        RolePermisos: `${numeroRoles} ${numeroRoles === 1 ? 'permiso' : 'permisos'}`,
        RoleUsuarios: `${numeroUsuarios} ${numeroUsuarios === 1 ? 'usuario' : 'usuarios'}`
      };
    });
  }, [employeesFromStore, rolesFromStore]);

  return (
    <>
      <Row>
        <Col xl={8}>
          <h4 className="header-title text-dark">Gestor de roles</h4>
        </Col>

        <Col xl={4}>
          <div className="text-lg-end">
            <Button className="text-lg-end" variant="success">
              <i className="mdi mdi-account-cog" /> Crear Rol
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <ReactTable<thisRol>
            theadClass="table-light"
            searchBoxClass="my-2"
            columns={columns}
            data={roles}
            showPagination
            isSearchable={true}
            getRowCanExpand={() => true}
            renderSubComponent={renderSubComponent}
          />
        </Col>
      </Row>
    </>
  );
});

export {Roles};
