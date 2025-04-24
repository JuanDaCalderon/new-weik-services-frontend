import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {DateUtils, getCargoUser, getNombreCompletoUser, getUserNameUser} from '@/utils';
import {useCallback, useState, ChangeEvent, useMemo} from 'react';
import {Button, Card, Form} from 'react-bootstrap';
import DisplayInfo from './DisplayInfo';
import LabelWithControl from './LabelWithControl';
import {Spinner} from '@/components';
import useUpdateData from './useUpdateData';

const InfoUserBox = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const {formData, handleInputChange, isFormChanged, isLoading, updateData} = useUpdateData();

  const handleSwitchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  }, []);

  const editableFields = useMemo(() => {
    return [
      {id: 'nombres', name: 'nombres', label: 'Nombres', type: 'text', value: formData.nombres},
      {
        id: 'apellidos',
        name: 'apellidos',
        label: 'Apellidos',
        type: 'text',
        value: formData.apellidos
      },
      {
        id: 'userName',
        name: 'userName',
        label: 'Nombre de usuario',
        type: 'text',
        value: formData.userName
      },
      {
        id: 'fechaNacimiento',
        name: 'fechaNacimiento',
        label: 'Fecha de nacimiento',
        type: 'date',
        value: formData.fechaNacimiento
      },
      {
        id: 'numeroDocumento',
        name: 'numeroDocumento',
        label: 'Número de documento',
        type: 'number',
        value: formData.numeroDocumento
      },
      {
        id: 'ciudadExpedicionDocumento',
        name: 'ciudadExpedicionDocumento',
        label: 'Lugar de expedición',
        type: 'text',
        value: formData.ciudadExpedicionDocumento
      }
    ];
  }, [
    formData.apellidos,
    formData.ciudadExpedicionDocumento,
    formData.fechaNacimiento,
    formData.nombres,
    formData.numeroDocumento,
    formData.userName
  ]);

  const readOnlyFields = useMemo(() => {
    return [
      {label: 'Nombre completo', value: getNombreCompletoUser(user)},
      {label: 'Nombre de usuario', value: getUserNameUser(user)},
      {label: 'Email', value: user.email},
      {label: 'Cargo', value: getCargoUser(user)},
      {
        label: 'Cumpleaños',
        value: DateUtils.formatLongDate(DateUtils.parseStringToDate(user.fechaNacimiento))
      },
      {label: 'Número de documento', value: user.numeroDocumento},
      {label: 'Lugar de Expedición', value: user.ciudadExpedicionDocumento},
      {label: 'Fecha de ingreso', value: undefined},
      {label: 'Salario', value: undefined}
    ];
  }, [user]);

  return (
    <Card>
      <Card.Body>
        <div className="text-start position-relative">
          <Form.Check
            reverse
            className="cursor-pointer position-absolute top-0 end-0"
            type="switch"
            id="user-info-switch"
            label={<i className={`mdi mdi-wrench cursor-pointer ${isChecked && 'text-primary'}`}></i>}
            checked={isChecked}
            onChange={handleSwitchChange}
          />

          {isChecked
            ? editableFields.map((field) => (
                <LabelWithControl
                  key={field.id}
                  id={field.id}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={field.value}
                  onChange={handleInputChange}
                />
              ))
            : readOnlyFields.map((field, index) => (
                <DisplayInfo
                  key={index}
                  label={field.label}
                  value={field.value}
                  className={index === readOnlyFields.length - 1 ? 'mb-0' : 'mb-2'}
                />
              ))}

          {isChecked && (
            <Button className="w-100 mt-2" variant="primary" disabled={!isFormChanged} onClick={updateData}>
              {isLoading && <Spinner className="spinner-border-sm" tag="span" color="white" />}
              {!isLoading && 'Actualizar información'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export {InfoUserBox};
