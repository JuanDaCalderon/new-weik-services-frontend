import {ChangeEvent, memo, useCallback, useMemo, useState} from 'react';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {Employee, Option} from '@/types';
import {useAppSelector} from '@/store';
import Select, {MultiValue} from 'react-select';
import {clientesOptionsSelector, rolesSelector, selectEmployees} from '@/store/selectores';
import {ESTADOS, THIS_CLIENT_INFO} from '@/constants';
import {checkIfUserExists, DebugUtil, generateUsername, isValidEmail} from '@/utils';
import {useAddUser, useCreateUserAuth, useGetEmployees, useUpdateUser} from '@/endpoints';
import toast from 'react-hot-toast';
import {Spinner} from '@/components';
const userDatosIniciales: Employee = {
  nombres: '',
  apellidos: '',
  cargo: '',
  email: ''
} as Employee;

const CrearUsuarios = memo(function CrearUsuarios() {
  const users = useAppSelector(selectEmployees);
  const clientes = useAppSelector(clientesOptionsSelector);
  const clientesOptions: Option[] = useMemo(() => {
    const optionsClients: Option[] = [];
    optionsClients.push({value: THIS_CLIENT_INFO.DOMAIN, label: THIS_CLIENT_INFO.LABEL}, ...clientes);
    return optionsClients;
  }, [clientes]);
  const roles = useAppSelector(rolesSelector);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [deactivateAutoEmail, setDeactivateAutoEmail] = useState<boolean>(false);
  const [clienteSelected, setClienteSelected] = useState<string>(clientesOptions[0].value);
  const [password, setpassword] = useState<string>('000000');
  const [selectedOptionsRoles, setSelectedOptionsRoles] = useState<{value: string; label: string}[]>([]);
  const [newUser, setNewUser] = useState<Employee>(userDatosIniciales);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const {getEmployeesSync} = useGetEmployees();
  const {addUser, isLoadingAddUser} = useAddUser();
  const {createAuthUser, isLoadingCreateAuthUser} = useCreateUserAuth();
  const {updatedRolesOfUser, isLoadingUsersToRol} = useUpdateUser();

  const rolesOptions: Option[] = useMemo(() => roles.map((rol) => ({value: rol.id, label: rol.rol})), [roles]);

  const handleCheckBoxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDeactivateAutoEmail(e.target.checked);
  }, []);

  const handleInputChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setpassword(e.target.value);
    setHasTouched(true);
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      if (deactivateAutoEmail) setNewUser((prev) => ({...prev, [name]: value.toLowerCase()}));
      else {
        const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setNewUser((prev) => ({
          ...prev,
          [name]: name === 'email' && !isValidEmail(value) ? value.split('@')[0].toLowerCase() : value.toLowerCase()
        }));
      }
      setHasTouched(true);
    },
    [deactivateAutoEmail]
  );

  const handleClienteSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (!deactivateAutoEmail)
        setNewUser((prev) => ({
          ...prev,
          email: `${prev.email.split('@')[0]}@${e.target.value}.com`.toLowerCase()
        }));
      setClienteSelected(e.target.value.toLowerCase());
      setHasTouched(true);
    },
    [deactivateAutoEmail]
  );

  const handleSelectChange = useCallback((selected: MultiValue<{value: string; label: string}>) => {
    setSelectedOptionsRoles(selected as {value: string; label: string}[]);
    setHasTouched(true);
  }, []);

  const isValidUser = useCallback((userData: Employee): boolean => {
    return (
      !!userData &&
      !!userData.nombres.trim() &&
      !!userData.apellidos.trim() &&
      !!userData.cargo.trim() &&
      !!userData.email.trim()
    );
  }, []);

  const resetForm = useCallback(() => {
    setNewUser(userDatosIniciales);
    setSelectedOptionsRoles([]);
    setClienteSelected(clientesOptions[0].value);
    setHasTouched(false);
  }, [clientesOptions]);

  const enviarUser = useCallback(async () => {
    if (!isValidUser(newUser)) {
      toast.error('Todos los campos son obligatorios. Por favor, complételos.');
      setHasTouched(false);
      return;
    }
    const usuario: Employee = {
      ...newUser,
      userName: generateUsername(newUser.nombres, newUser.apellidos),
      email: newUser.email.includes('@')
        ? newUser.email.toLowerCase()
        : `${newUser.email}@${clienteSelected}.com`.toLowerCase(),
      estado: ESTADOS.offline,
      horario: [],
      horasTrabajo: [],
      permisosDenegados: [],
      permisosOtorgados: [],
      roles: [],
      vacaciones: [],
      numeroDocumento: '',
      ciudadExpedicionDocumento: '',
      userImage: ''
    };
    if (checkIfUserExists(usuario, users)) {
      toast.error('El usuario no se pudo crear, ya existen registros con el mismo Email.');
      return;
    }
    if (!isValidEmail(usuario.email)) {
      toast.error('El email no tiene un formato válido. Ejemplo: usuario@dominio.com');
      return;
    }
    if (selectedOptionsRoles.length <= 0) {
      toast.error('Ningún rol seleccionado. Debes asignar al menos uno.');
      return;
    }

    try {
      await createAuthUser(usuario.email, password);
      const selectedValues = new Set(selectedOptionsRoles.map((rol) => rol.value));
      const updatedRoles = Array.from(selectedValues);
      const newUserId = await addUser(usuario);
      if (newUserId) await updatedRolesOfUser(newUserId, updatedRoles);
      await getEmployeesSync();
      resetForm();
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [
    addUser,
    clienteSelected,
    createAuthUser,
    getEmployeesSync,
    isValidUser,
    newUser,
    password,
    resetForm,
    selectedOptionsRoles,
    updatedRolesOfUser,
    users
  ]);

  return (
    <>
      <p className="weik-text-grey-200 my-1">
        Completa los campos y haz clic en "Crear" para añadir un usuario enlazado a un cliente en específico.
        <br />
        El nombre de usuario "username" se genera automáticamente, pero puede cambiarse desde el perfil.
      </p>
      <Form.Label className="mb-0" htmlFor="nombres">
        <strong>Nombres del usuario:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        type="text"
        id="nombres"
        name="nombres"
        required
        placeholder="Ingrese los nombres del usuario"
        value={newUser.nombres}
        onChange={handleInputChange}
      />
      <Form.Label className="mb-0 mt-1" htmlFor="apellidos">
        <strong>Apellidos del usuario:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        type="text"
        id="apellidos"
        name="apellidos"
        required
        placeholder="Ingrese los apellidos del usuario"
        value={newUser.apellidos}
        onChange={handleInputChange}
      />
      <Form.Label className="mb-0 mt-1" htmlFor="cargo">
        <strong>Cargo del usuario:</strong>
      </Form.Label>
      <Form.Control
        size="sm"
        type="url"
        id="cargo"
        name="cargo"
        required
        placeholder="Ingrese el cargo del usuario"
        value={newUser.cargo}
        onChange={handleInputChange}
      />
      <Form.Label className="mb-0 mt-1" htmlFor="cliente">
        <strong>Cliente asociado:</strong>
      </Form.Label>
      <Form.Select size="sm" id="cliente" aria-label="Cliente asociado" onChange={handleClienteSelectChange}>
        {clientesOptions.map((cliente, index) => (
          <option key={index} value={cliente.value}>
            {cliente.label}
          </option>
        ))}
      </Form.Select>
      <div className="d-flex justify-content-between">
        <Form.Label className="mb-0 mt-1" htmlFor="email">
          <strong>Email del usuario:</strong>
        </Form.Label>
        <Form.Check
          onChange={handleCheckBoxChange}
          checked={deactivateAutoEmail}
          className="mt-1"
          type="checkbox"
          label="Desactivar email autogenerado"
        />
      </div>
      <Form.Control
        size="sm"
        type="text"
        id="email"
        name="email"
        required
        placeholder="NO es necesario poner @cliente.com"
        value={newUser.email}
        onChange={handleInputChange}
      />
      <p className="d-inline-block p-0 m-0 font-12 text-danger w-100 text-end">
        Solo ingresa la parte antes del @ para crear el email, ya que al seleccionar el cliente, este se autocompletará
        automáticamente. Todos los usuarios deben estar asociados a el dominio de un cliente, ya sea un cliente externo
        o el cliente raíz (Weikstudio), donde pueden tener roles como diseñador, administrador u otros.
      </p>
      <Form.Label className="mb-0 mt-1" htmlFor="password">
        <strong>Contraseña:</strong>
      </Form.Label>
      <InputGroup className="mb-0">
        <Form.Control
          id="password"
          size="sm"
          type={showPassword ? 'text' : 'password'}
          onChange={handleInputChangePassword}
          autoComplete="current-password"
          name="password"
          value={password}
        />
        <div
          className={`input-group-text input-group-password py-0 px-2 ${showPassword ? 'show-password' : ''}`}
          data-password={showPassword ? 'true' : 'false'}>
          <span
            className="password-eye"
            onClick={() => {
              setShowPassword(!showPassword);
            }}></span>
        </div>
      </InputGroup>
      <p className="d-inline-block p-0 m-0 font-12 text-danger w-100 text-end">La contraseña por defecto sera 000000</p>
      <Form.Label className="mb-0" htmlFor="roles">
        <strong>Roles:</strong>
      </Form.Label>
      <Select
        isMulti={true}
        options={rolesOptions}
        value={selectedOptionsRoles}
        onChange={handleSelectChange}
        className="react-select"
        classNamePrefix="react-select"
        placeholder="No hay roles asignados"
      />
      <Button
        disabled={!hasTouched || isLoadingAddUser || isLoadingCreateAuthUser || isLoadingUsersToRol}
        variant="success"
        className="w-100 mt-2"
        onClick={enviarUser}>
        {(isLoadingAddUser || isLoadingCreateAuthUser || isLoadingUsersToRol) && (
          <Spinner className="spinner-border-sm" tag="span" color="white" />
        )}
        {!isLoadingAddUser && !isLoadingCreateAuthUser && !isLoadingUsersToRol && (
          <>
            <i className="mdi mdi-plus-circle me-1" /> Crear
          </>
        )}
      </Button>
    </>
  );
});

export {CrearUsuarios};
