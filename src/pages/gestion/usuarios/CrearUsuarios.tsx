import {ChangeEvent, memo, useCallback, useMemo, useState} from 'react';
import {Col, Form, InputGroup, Row} from 'react-bootstrap';
import {Employee, Option} from '@/types';
import {useAppSelector} from '@/store';
import Select, {MultiValue} from 'react-select';
import {clientesOptionsSelector, rolesSelector, selectEmployees} from '@/store/selectores';
import {ESTADOS, THIS_CLIENT_INFO} from '@/constants';
import {checkIfUserExists, DebugUtil, generateUsername, isValidEmail} from '@/utils';
import {useAddUser, useCreateUserAuth, useGetEmployees, useUpdateUser} from '@/endpoints';
import toast from 'react-hot-toast';
import {FormWrapper, InputField} from '@/components/Form2';
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
      <Row>
        <Col>
          <h4 className="header-title text-dark text-opacity-75 ms-1 mb-2">Crear usuario</h4>
        </Col>
        <Col xs={12}>
          <p className="m-0">
            Completa los campos y haz clic en "Crear" para añadir un usuario enlazado a un cliente en específico, el
            nombre de usuario "username" se genera automáticamente, pero puede cambiarse desde el perfil.
          </p>
        </Col>
        <Col xs={12}>
          <hr></hr>
        </Col>
      </Row>

      <FormWrapper
        isDisabled={!hasTouched || isLoadingAddUser || isLoadingCreateAuthUser || isLoadingUsersToRol}
        isLoading={isLoadingAddUser || isLoadingCreateAuthUser || isLoadingUsersToRol}
        submitLabel="Crear Usuario"
        onSubmit={enviarUser}>
        <InputField
          xs={12}
          md={4}
          label="Nombres del usuario"
          type="text"
          required
          pattern="^[A-Za-zÑñ]+(?: [A-Za-zÑñ]+)*$"
          name="nombres"
          helperText="Los nombres del usuario son obligatorios y deben contener solo letras."
          value={newUser.nombres}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="Apellidos del usuario"
          type="text"
          required
          pattern="^[A-Za-zÑñ]+(?: [A-Za-zÑñ]+)*$"
          name="apellidos"
          helperText="Los apellidos del usuario son obligatorios y deben contener solo letras."
          value={newUser.apellidos}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          md={4}
          label="Cargo del usuario"
          type="text"
          required
          pattern="^[A-Za-zÑñ]+(?: [A-Za-zÑñ]+)*$"
          name="cargo"
          helperText="El cargo del usuario es obligatorio y debe contener solo letras."
          value={newUser.cargo}
          onChange={handleInputChange}
        />
        <Col xs={12} md={6}>
          <Form.Label htmlFor="cliente" className="mb-1">
            <strong>Cliente asociado</strong>
          </Form.Label>
          <Form.Select
            required
            size="sm"
            id="cliente"
            aria-label="Cliente asociado"
            onChange={handleClienteSelectChange}>
            {clientesOptions.map((cliente, index) => (
              <option key={index} value={cliente.value}>
                {cliente.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={6}>
          <div className="d-flex justify-content-between">
            <Form.Label htmlFor="email" className="mb-1">
              <strong>Email del usuario:</strong>
            </Form.Label>
            <Form.Check
              onChange={handleCheckBoxChange}
              checked={deactivateAutoEmail}
              type="checkbox"
              label="Desactivar email autogenerado"
            />
          </div>
          <Form.Control
            size="sm"
            type="email"
            id="email"
            name="email"
            required
            placeholder="NO es necesario poner @cliente.com"
            value={newUser.email}
            onChange={handleInputChange}
          />
        </Col>
        <Col xs={12}>
          <Form.Text className="text-danger">
            Solo ingresa la parte antes del @ para crear el email, ya que al seleccionar el cliente, este se
            autocompletará automáticamente. Todos los usuarios deben estar asociados a el dominio de un cliente, ya sea
            un cliente externo o el cliente raíz (Weikstudio), donde pueden tener roles como diseñador, administrador u
            otros.
          </Form.Text>
        </Col>
        <Col xs={12} md={6}>
          <Form.Label className="mb-1" htmlFor="password">
            <strong>Contraseña:</strong>
          </Form.Label>
          <InputGroup className="mb-0">
            <Form.Control
              id="password"
              size="sm"
              type={showPassword ? 'text' : 'password'}
              required
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
          <Form.Text className="text-muted">La contraseña por defecto sera 000000</Form.Text>
        </Col>
        <Col xs={12} md={6}>
          <Form.Label className="mb-1" htmlFor="roles">
            <strong>Roles:</strong>
          </Form.Label>
          <Select
            isMulti={true}
            options={rolesOptions}
            value={selectedOptionsRoles}
            onChange={handleSelectChange}
            required
            className="react-select"
            classNamePrefix="react-select"
            placeholder="No hay roles asignados"
          />
        </Col>
      </FormWrapper>
    </>
  );
});

export {CrearUsuarios};
