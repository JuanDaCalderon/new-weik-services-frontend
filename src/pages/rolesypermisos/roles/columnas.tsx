import {Rol, thisRol} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import {Badge, Button, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {DateUtils, DebugUtil, hasPermission} from '@/utils';
import type {Row} from '@tanstack/react-table';
import {useRolesUsuariosContext} from '@/pages/rolesypermisos/context';
import {memo, useCallback, useMemo, JSX, ChangeEvent, useState} from 'react';
import {PERMISOS_MAP_IDS, ROLES_CELLS} from '@/constants';
import {useAppSelector} from '@/store';
import {selectEmployees, selectUser} from '@/store/selectores';
import {useToggle} from '@/hooks';
import {GenericModal} from '@/components';
import toast from 'react-hot-toast';
import {useDeleteRol, useRemoveRolesFromUser} from '@/endpoints';

const RolNameColumn = memo(function RolNameColumn({row}: {row: Row<thisRol>}) {
  const {updateRolesCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    const toggleHandler = row.getToggleExpandedHandler();
    if (row.getIsExpanded() && rolesUsuarios.rolesCell !== ROLES_CELLS.rol) toggleHandler();
    updateRolesCell(ROLES_CELLS.rol);
    toggleHandler();
  }, [rolesUsuarios.rolesCell, row, updateRolesCell]);

  const getfeedbackIcon = (): string => {
    return row.getIsExpanded() && rolesUsuarios.rolesCell === ROLES_CELLS.rol ? '👇' : '👉';
  };

  return (
    <div className="ribbon-box no-user-text-selectable">
      {DateUtils.isToday(row.original.ribbonCreatedDate) ? (
        <div className="ribbon-two ribbon-two-success end-0" style={{left: '84%', top: '-11px'}}>
          <span className="font-12">Nuevo Rol</span>
        </div>
      ) : (
        DateUtils.isToday(row.original.ribbonUpdatedDate) && (
          <div className={`ribbon-two ribbon-two-info end-0`} style={{left: '84%', top: '-10px'}}>
            <span className="font-12">Actualizado</span>
          </div>
        )
      )}
      <div className={`${row.getCanExpand() && 'cursor-pointer scale-hover'}`} onClick={onClickHandled}>
        <div className=" d-flex justify-content-start align-content-center align-items-center">
          {row.getCanExpand() && (
            <span className="d-block mb-1" style={{width: '20px', height: '20px'}}>
              {getfeedbackIcon()}
            </span>
          )}
          <span className="d-block no-user-text-selectable fw-bold text-uppercase text-dark text-opacity-75">
            {row.original.rolName}
          </span>
        </div>
        <span className="d-inline-block" style={{maxWidth: '400px'}}>
          {row.original.descripcion || row.original.rolName}
        </span>
      </div>
    </div>
  );
});

const RolePermisosColumn = memo(function RolePermisosColumn({row}: {row: Row<thisRol>}) {
  const {updateRolesCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    const toggleHandler = row.getToggleExpandedHandler();
    if (row.getIsExpanded() && rolesUsuarios.rolesCell !== ROLES_CELLS.permisos) toggleHandler();
    updateRolesCell(ROLES_CELLS.permisos);
    toggleHandler();
  }, [rolesUsuarios.rolesCell, row, updateRolesCell]);

  const getfeedbackIcon = (): string => {
    return row.getIsExpanded() && rolesUsuarios.rolesCell === ROLES_CELLS.permisos ? '👇' : '👉';
  };

  return (
    <div
      className={`ribbon-box no-user-text-selectable ${row.getCanExpand() && 'cursor-pointer scale-hover'}`}
      onClick={onClickHandled}>
      {row.getCanExpand() && (
        <span className="me-1" style={{width: '20px', height: '20px'}}>
          {getfeedbackIcon()}
        </span>
      )}
      <Badge bg="" pill className="me-1 badge-outline-info font-14">
        {row.original.RolePermisos}
      </Badge>
    </div>
  );
});

const RoleUsuariosColumn = memo(function RoleUsuariosColumn({row}: {row: Row<thisRol>}) {
  const {updateRolesCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    if (row.original.RoleUsuarios) {
      const toggleHandler = row.getToggleExpandedHandler();
      if (row.getIsExpanded() && rolesUsuarios.rolesCell !== ROLES_CELLS.usuarios) toggleHandler();
      updateRolesCell(ROLES_CELLS.usuarios);
      toggleHandler();
    }
  }, [rolesUsuarios.rolesCell, row, updateRolesCell]);

  const roleUsuarios: string = useMemo(() => {
    return row.original.RoleUsuarios ? row.original.RoleUsuarios : 'cargando';
  }, [row.original.RoleUsuarios]);

  const getfeedbackIcon = (): string => {
    if (row.getIsExpanded() && rolesUsuarios.rolesCell === ROLES_CELLS.usuarios) return '👇';
    else return row.original.RoleUsuarios ? '👉' : '⏳';
  };

  return (
    <div
      className={`ribbon-box no-user-text-selectable ${row.original.RoleUsuarios && `${row.getCanExpand() && 'cursor-pointer scale-hover'}`}`}
      style={{transformOrigin: 'center'}}
      onClick={onClickHandled}>
      {row.getCanExpand() && (
        <span className="me-1" style={{width: '20px', height: '20px'}}>
          {getfeedbackIcon()}
        </span>
      )}
      <Badge bg="" pill className="me-1 badge-outline-warning font-14">
        {roleUsuarios}
      </Badge>
    </div>
  );
});

const EliminarRol = memo(function EliminarRol({row}: {row: Row<thisRol>}) {
  const user = useAppSelector(selectUser);
  const employees = useAppSelector(selectEmployees);
  const [rolName, setRolName] = useState<string>('');
  const [isReadyToBeDeleted, setIsReadyToBeDeleted] = useState<boolean>(true);
  const [deleteOpen, deleteToggle, showDelete, hideDelete] = useToggle();
  const {deleteRol, isLoadingDeleteRol} = useDeleteRol();
  const {removeRolesFromUser, isLoadingRemoveRolesFromUser} = useRemoveRolesFromUser();

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setRolName(e.target.value);
      setIsReadyToBeDeleted(e.target.value !== row.original.rolName);
    },
    [row.original.rolName]
  );

  const onDeleteRol = useCallback(async () => {
    try {
      const rolToBeDeleted: Pick<Rol, 'id' | 'rol'> = {
        id: `${row.original.id}`,
        rol: row.original.rolName
      };
      for (const employee of employees) {
        await removeRolesFromUser(employee, rolToBeDeleted);
      }
      await deleteRol(rolToBeDeleted.id);
      hideDelete();
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
      toast.error('Error al eliminar el rol. Inténtelo más tarde.');
    }
  }, [deleteRol, employees, hideDelete, removeRolesFromUser, row.original.id, row.original.rolName]);

  const deleteModalBody: JSX.Element = useMemo(
    () => (
      <>
        <div className="w-100 mb-1">
          <p className="p-0 m-0">
            Esta seguro que quiere eliminar el rol: <b>{row.original.rolName}</b>
          </p>
          <p className="p-0 m-0 text-danger">
            Eliminar un rol implica la eliminación permanente de todos los registros y datos asociados.
          </p>
        </div>
        <Form.Label className="text-danger cursor-pointer mb-0" htmlFor="rol">
          <strong>Ingrese el nombre del rol para eliminarlo:</strong>
        </Form.Label>
        <Form.Control
          size="sm"
          type="text"
          id="rol"
          name="rol"
          placeholder="Ingrese el nombre del rol"
          value={rolName}
          onChange={handleInputChange}
        />
      </>
    ),
    [handleInputChange, rolName, row.original.rolName]
  );

  const canDeleteRoles = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.eliminarRoles, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  return (
    <>
      <div className="d-flex gap-1">
        {canDeleteRoles && (
          <OverlayTrigger overlay={<Tooltip id="eliminarRol">Eliminar Rol</Tooltip>}>
            <Button id="eliminarRol" variant="outline-danger py-0 px-1" onClick={showDelete}>
              <i className="uil-trash"></i>
            </Button>
          </OverlayTrigger>
        )}
        {!canDeleteRoles && <span>No tiene permisos</span>}
      </div>
      {canDeleteRoles && (
        <GenericModal
          show={deleteOpen}
          onToggle={deleteToggle}
          variant="danger"
          headerText={`Eliminar rol ${row.original.rolName}`}
          submitText="Eliminar"
          secondaryText="Cancelar"
          body={deleteModalBody}
          isDisabled={isReadyToBeDeleted || isLoadingDeleteRol || isLoadingRemoveRolesFromUser}
          isLoading={isLoadingDeleteRol || isLoadingRemoveRolesFromUser}
          onSend={onDeleteRol}
        />
      )}
    </>
  );
});

const rolesColumns: ColumnDef<thisRol>[] = [
  {
    header: 'Rol',
    accessorKey: 'rolName',
    cell: RolNameColumn
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
    cell: RolePermisosColumn
  },
  {
    header: 'Usuarios del rol',
    accessorKey: 'RoleUsuarios',
    cell: RoleUsuariosColumn
  },
  {
    header: 'Eliminar',
    accessorKey: 'eliminar',
    cell: EliminarRol
  }
];

export {rolesColumns};
