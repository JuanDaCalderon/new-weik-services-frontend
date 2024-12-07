import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {getCargoUser, getNombreCompletoUser, getUserNameUser} from '@/utils';
import {useCallback, useState, ChangeEvent, useEffect, useMemo} from 'react';
import {Button, Card, Form} from 'react-bootstrap';

const InfoUserBox = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    userName: '',
    fechaNacimiento: '',
    numeroDocumento: '',
    ciudadExpedicionDocumento: ''
  });

  const user = useAppSelector(selectUser);

  useEffect(() => {
    setFormData({
      nombres: user.nombres,
      apellidos: user.apellidos,
      ciudadExpedicionDocumento: user.ciudadExpedicionDocumento,
      userName: user.userName,
      numeroDocumento: user.numeroDocumento,
      fechaNacimiento: ''
    });
  }, [
    user.apellidos,
    user.ciudadExpedicionDocumento,
    user.nombres,
    user.numeroDocumento,
    user.userName
  ]);

  const nombreCompleto: string = useMemo(() => {
    return getNombreCompletoUser(user);
  }, [user]);

  const userNameUser: string = useMemo(() => {
    return getUserNameUser(user);
  }, [user]);

  const cargoUser: string = useMemo(() => {
    return getCargoUser(user);
  }, [user]);

  const handleSwitchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const submitUpdatedData = useCallback(() => {
    console.log('🚀 ~ InfoUserBox ~ formData:', formData);
  }, [formData]);

  return (
    <Card>
      <Card.Body>
        <div className="text-start position-relative">
          <Form.Check
            reverse
            className="cursor-pointer position-absolute top-0 end-0"
            type="switch"
            id="custom-switch"
            label={
              <i className={`mdi mdi mdi-wrench cursor-pointer ${isChecked && 'text-primary'}`}></i>
            }
            checked={isChecked}
            onChange={handleSwitchChange}
          />

          {isChecked ? (
            <>
              <Form.Label className="text-dark cursor-pointer mb-0 mt-1" htmlFor="nombres">
                <strong>Nombres:</strong>
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
              />
              <Form.Label className="text-dark cursor-pointer m-0 mt-1" htmlFor="apellidos">
                <strong>Apellidos:</strong>
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
              />
              <Form.Label className="text-dark cursor-pointer m-0 mt-1" htmlFor="userName">
                <strong>Nombre de usuario:</strong>
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
              />
              <Form.Label className="text-dark cursor-pointer m-0 mt-1" htmlFor="fechaNacimiento">
                <strong>Fecha de nacimiento:</strong>
              </Form.Label>
              <Form.Control
                size="sm"
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <p className="text-dark mb-2">
                <strong>Nombre completo:</strong>
                <span className="ms-2 text-dark text-opacity-75">{nombreCompleto}</span>
              </p>

              <p className="text-dark mb-2">
                <strong>Nombre de usuario:</strong>
                <span className="ms-2 text-dark text-opacity-75">{userNameUser}</span>
              </p>

              <p className="text-dark mb-2">
                <strong>Email:</strong>{' '}
                <span className="ms-2 text-dark text-opacity-75">{user.email}</span>
              </p>

              <p className="text-dark mb-2">
                <strong>Cargo:</strong>{' '}
                <span className="ms-2 text-dark text-opacity-75">{cargoUser}</span>
              </p>

              <p className="text-dark mb-0">
                <strong>Cumpleaños:</strong>
                <span className="ms-2 text-dark text-opacity-75"> Fecha de nacimiento </span>
              </p>
            </>
          )}

          <hr />
          <p className="text-dark text-opacity-75">
            La información a continuación es esencial para la emisión de certificados laborales, así
            como otros documentos y solicitudes relacionados con el ámbito laboral.
          </p>

          {isChecked ? (
            <>
              <Form.Label className="text-dark cursor-pointer mb-0" htmlFor="numeroDocumento">
                <strong>Número de documento:</strong>
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleInputChange}
              />
              <Form.Label
                className="text-dark cursor-pointer m-0 mt-1"
                htmlFor="ciudadExpedicionDocumento">
                <strong>Lugar de expedición:</strong>
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                id="ciudadExpedicionDocumento"
                name="ciudadExpedicionDocumento"
                value={formData.ciudadExpedicionDocumento}
                onChange={handleInputChange}
              />
              <Button className="w-100 mt-2" variant="primary" onClick={submitUpdatedData}>
                Actualizar información
              </Button>
            </>
          ) : (
            <>
              <p className="text-dark mb-2">
                <strong>Número de documento:</strong>{' '}
                <span className="ms-2 text-dark text-opacity-75">
                  {user.numeroDocumento && 'sin número de documento'}
                </span>
              </p>
              <p className="text-dark mb-2">
                <strong>Lugar de Expedición:</strong>
                <span className="ms-2 text-dark text-opacity-75">
                  {' '}
                  {user.ciudadExpedicionDocumento && 'sin lugar de expedición'}{' '}
                </span>
              </p>
              <p className="text-dark mb-2">
                <strong>Fecha de ingreso:</strong>
                <span className="ms-2 text-dark text-opacity-75"> 24 de Diciembre de 2023 </span>
              </p>
              <p className="text-dark mb-0">
                <strong>Salario:</strong>
                <span className="ms-2 text-dark text-opacity-75"> $0000000000 </span>
              </p>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default InfoUserBox;
