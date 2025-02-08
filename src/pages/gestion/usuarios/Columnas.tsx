import {Employee} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {GenericModal} from '@/components/Modals/GenericModal';
import {ChangeEvent, memo, useCallback, useMemo, useState, JSX, Fragment} from 'react';
import {
  Badge,
  Button,
  Dropdown,
  DropdownButton,
  Form,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {useToggle} from '@/hooks';
import {getNombreCompletoUser, DateUtils, DebugUtil, hasPermission} from '@/utils';
import {ESTADOS, PERMISOS_MAP_IDS, RIBBONTYPES} from '@/constants';
import {useDeleteUser, useGetEmployees, useSetEstadoUser} from '@/endpoints';
import toast from 'react-hot-toast';
import fallBackLogo from '@/assets/images/logo-fallback.png';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

const UsuariosAcciones = memo(function RolNameColumn({row}: {row: Row<Employee>}) {
  const user = useAppSelector(selectUser);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isReadyToBeDeleted, setIsReadyToBeDeleted] = useState<boolean>(true);
  const [deactivateOpen, deactivateToggle, showDeactivate, hideDeactivate] = useToggle();
  const [activateOpen, activateToggle, showActivate, hideActivate] = useToggle();
  const [deleteOpen, deleteToggle, showDelete, hideDelete] = useToggle();
  const {setInactiveUser, isLoadingInactiveUser, setOfflineUser, isLoadingOfflineUser} =
    useSetEstadoUser();
  const {getEmployeesSync} = useGetEmployees();
  const {deleteUser, isLoadingDeleteUser} = useDeleteUser();

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUserEmail(e.target.value);
      setIsReadyToBeDeleted(e.target.value !== row.original.email);
    },
    [row.original.email]
  );

  const onDeleteUser = useCallback(async () => {
    try {
      await deleteUser(row.original.id);
      toast.success(`el usuario ${row.original.email} ha sido eliminado`);
      hideDelete();
      await getEmployeesSync();
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
      toast.error('Error al eliminar el usuario. Inténtelo más tarde.');
    }
  }, [deleteUser, getEmployeesSync, hideDelete, row.original.email, row.original.id]);

  const onDeactivateUser = useCallback(async () => {
    try {
      await setInactiveUser(row.original.id);
      toast.success(`el usuario ${row.original.email} ha sido desacivado`);
      hideDeactivate();
      await getEmployeesSync();
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
      toast.error('Error al desactivar el usuario. Inténtelo más tarde.');
    }
  }, [getEmployeesSync, hideDeactivate, row.original.email, row.original.id, setInactiveUser]);

  const onActivateUser = useCallback(async () => {
    try {
      await setOfflineUser(row.original.id);
      toast.success(`el usuario ${row.original.email} ha sido reactivado`);
      hideActivate();
      await getEmployeesSync();
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
      toast.error('Error al reactivar el usuario. Inténtelo más tarde.');
    }
  }, [getEmployeesSync, hideActivate, row.original.email, row.original.id, setOfflineUser]);

  const deactivateModalBody: JSX.Element = useMemo(
    () => (
      <p>
        Desactivar un usuario no elimina su cuenta ni la información y datos asociados. Sin embargo,
        el usuario no podrá acceder a la plataforma y quedará en estado <b>INACTIVO</b>. En este
        estado, el usuario no aparecerá en los módulos de equipo, en el estado de los integrantes y
        tampoco podrá recibir asignaciones ni realizar ninguna acción dentro del sistema.
      </p>
    ),
    []
  );

  const activateModalBody: JSX.Element = useMemo(
    () => <p>Reactivar al usuario le permitirá acceder nuevamente a la plataforma.</p>,
    []
  );

  const deleteModalBody: JSX.Element = useMemo(
    () => (
      <>
        <div className="d-flex w-100 justify-content-around align-items-center gap-1 mb-1">
          <img
            src={
              row.original.userImage && row.original.userImage !== ''
                ? row.original.userImage
                : fallBackLogo
            }
            alt={
              row.original.userImage && row.original.userImage !== ''
                ? row.original.userImage
                : fallBackLogo
            }
            loading="lazy"
            width={100}
            height={100}
            className="img rounded-circle object-fit-contain d-block"
          />
          <div className="w-75">
            <p className="p-0 m-0">
              Esta seguro que quiere eliminar el usuario con el correo: <b>{row.original.email}</b>.
            </p>
            <p className="p-0 m-0 text-danger">
              Eliminar un usuario implica la eliminación permanente de todos los registros y datos
              asociados. Si no deseas perder esta información, considera desactivar el usuario en su
              lugar.
            </p>
          </div>
        </div>
        <Form.Label className="text-danger cursor-pointer mb-0" htmlFor="usuario">
          <strong>Ingrese el correo del usuario para eliminarlo:</strong>
        </Form.Label>
        <Form.Control
          size="sm"
          type="text"
          id="usuario"
          name="usuario"
          placeholder="Ingrese el correo del usuario"
          value={userEmail}
          onChange={handleInputChange}
        />
      </>
    ),
    [handleInputChange, row.original.email, row.original.userImage, userEmail]
  );

  const isInactive = useMemo(() => row.original.estado === ESTADOS.inactivo, [row.original.estado]);

  const canInactiveUsuarios = useMemo(() => {
    return hasPermission(
      PERMISOS_MAP_IDS.inactivarUsuarios,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canDeleteUsuarios = useMemo(() => {
    return hasPermission(
      PERMISOS_MAP_IDS.eliminarUsuarios,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  return (
    <>
      <div className="d-flex gap-1">
        {canInactiveUsuarios && (
          <>
            {isInactive ? (
              <OverlayTrigger overlay={<Tooltip id="activarUser">Activar usuario</Tooltip>}>
                <Button id="activarUser" variant="outline-info py-0 px-1" onClick={showActivate}>
                  <i className="uil-user-plus" />
                </Button>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger overlay={<Tooltip id="desactivarUser">Desactivar usuario</Tooltip>}>
                <Button
                  id="desactivarUser"
                  variant="outline-warning py-0 px-1"
                  onClick={showDeactivate}>
                  <i className="uil-user-times" />
                </Button>
              </OverlayTrigger>
            )}
          </>
        )}
        {canDeleteUsuarios && (
          <OverlayTrigger overlay={<Tooltip id="eliminarUser">Eliminar usuario</Tooltip>}>
            <Button id="eliminarUser" variant="outline-danger py-0 px-1" onClick={showDelete}>
              <i className="uil-trash"></i>
            </Button>
          </OverlayTrigger>
        )}
        {!canInactiveUsuarios && !canDeleteUsuarios && <span>No tiene permisos</span>}
      </div>
      {canInactiveUsuarios && (
        <>
          <GenericModal
            show={deactivateOpen}
            onToggle={deactivateToggle}
            variant="warning"
            headerText={`Desactivar usuario ${row.original.email}`}
            submitText="Desactivar"
            secondaryText="Cancelar"
            body={deactivateModalBody}
            isDisabled={isLoadingInactiveUser}
            isLoading={isLoadingInactiveUser}
            onSend={onDeactivateUser}
          />
          <GenericModal
            show={activateOpen}
            onToggle={activateToggle}
            variant="info"
            headerText={`Reactivar usuario ${row.original.email}`}
            submitText="Reactivar"
            secondaryText="Cancelar"
            body={activateModalBody}
            isDisabled={isLoadingOfflineUser}
            isLoading={isLoadingOfflineUser}
            onSend={onActivateUser}
          />
        </>
      )}
      {canDeleteUsuarios && (
        <GenericModal
          show={deleteOpen}
          onToggle={deleteToggle}
          variant="danger"
          headerText={`Eliminar usuario ${row.original.email}`}
          submitText="Eliminar"
          secondaryText="Cancelar"
          body={deleteModalBody}
          isDisabled={isReadyToBeDeleted || isLoadingDeleteUser}
          isLoading={isLoadingDeleteUser}
          onSend={onDeleteUser}
        />
      )}
    </>
  );
});

const EstadosColumn = memo(function EstadosColumn({row}: {row: Row<Employee>}) {
  const ribbonType = useMemo(() => {
    const estado = row.original.estado;
    const estadoMap: Record<string, RIBBONTYPES> = {
      [ESTADOS.online]: RIBBONTYPES.success,
      [ESTADOS.offline]: RIBBONTYPES.danger,
      [ESTADOS.inactivo]: RIBBONTYPES.warning
    };
    return estadoMap[estado] || RIBBONTYPES.info;
  }, [row.original.estado]);

  return (
    <div className="ribbon-box no-user-text-selectable">
      <Badge bg="" pill className={`me-1 badge-outline-${ribbonType} font-14`}>
        {row.original.estado}
      </Badge>
    </div>
  );
});

const RolesColumn = memo(function EstadosColumn({row}: {row: Row<Employee>}) {
  const hasRoles: boolean = useMemo(
    () => row.original.roles.length > 0,
    [row.original.roles.length]
  );
  return hasRoles ? (
    <DropdownButton
      variant="info"
      title="Roles"
      id="roles-dropdown"
      size="sm"
      drop="start"
      className="no-user-text-selectable">
      {row.original.roles.map(({rol}, index, roles) => (
        <Fragment key={index}>
          <Dropdown.Item className="py-0 px-2" disabled>
            {rol.toLowerCase()}
          </Dropdown.Item>
          {index !== roles.length - 1 && <Dropdown.Divider className="p-0 m-0" />}
        </Fragment>
      ))}
    </DropdownButton>
  ) : (
    <Button size="sm" disabled>
      Sin rol
    </Button>
  );
});

const columns: ColumnDef<Employee>[] = [
  {
    header: 'Usuario',
    accessorKey: 'email',
    cell: ({row}) => (
      <div className="d-flex align-items-center no-user-text-selectable table-user ribbon-box">
        {DateUtils.isToday(DateUtils.parseStringToDate(row.original.fechaCreacion)) && (
          <div
            className="ribbon-two ribbon-two-success end-0"
            style={{left: '70%', top: '-11px', height: '58px', width: '90px'}}>
            <span className="font-12" style={{left: '-8px', top: '20px'}}>
              Nuevo
            </span>
          </div>
        )}
        <img
          src={
            row.original.userImage && row.original.userImage !== ''
              ? row.original.userImage
              : fallBackLogo
          }
          alt={
            row.original.userImage && row.original.userImage !== ''
              ? row.original.userImage
              : 'user'
          }
          loading="lazy"
          className="me-1 rounded-circle object-fit-contain"
        />
        <div className="ms-1 d-flex flex-column">
          <span className="m-0 lh-sm fw-bold text-uppercase text-dark text-opacity-75 d-inline">
            {getNombreCompletoUser(row.original)}
          </span>
          <span className="m-0 lh-sm d-inline">{row.original.email}</span>
        </div>
      </div>
    )
  },
  {
    header: 'Fecha creación',
    accessorKey: 'fechaCreacion',
    cell: ({row}) => (
      <>{DateUtils.formatShortDate(DateUtils.parseStringToDate(row.original.fechaCreacion))}</>
    )
  },
  {
    header: 'Username',
    accessorKey: 'userName'
  },
  {
    header: 'Cargo',
    accessorKey: 'cargo'
  },
  {
    header: 'Roles',
    accessorKey: 'roles',
    cell: RolesColumn
  },
  {
    header: 'Estado',
    accessorKey: 'estado',
    cell: EstadosColumn
  },
  {
    header: 'Acciones',
    accessorKey: 'acciones',
    cell: UsuariosAcciones
  }
];

export {columns};
