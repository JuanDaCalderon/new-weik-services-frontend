import {Fragment, memo, useMemo} from 'react';
import {Button, Col} from 'react-bootstrap';
import {GenericModal} from '@/components';
import SimpleBar from 'simplebar-react';
import {HookForm, HookInputField, HookSelectField, HookSwitchField} from '@/components/Form2';
import {useTogglev2} from '@/hooks';
import {
  CUSTOM_FIELD_TYPE,
  PERMISOS_MAP_IDS,
  REGISTRO_ASSIGNMENT,
  REGISTRO_PRIORIDAD,
  REGISTRO_STATUS
} from '@/constants';
import {registrosCrearSchema, RegistrosCrearFormFields} from '@/pages/clientes/registros/schemas/createRegistro';
import {useAgregarRegistros} from '../hooks/useAgregarRegistros';
import {useTranslation} from 'react-i18next';
import {CustomFieldDefinition, Employee, Option} from '@/types';
import {capitalizeFirstLetter, getCustomDefaults, getNombreCompletoUser, hasPermission} from '@/utils';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {selectSelectedRows} from '@/store/selectores/selected-row';

type Props = {
  cliente: string | undefined;
  registerType: string;
  customFields: CustomFieldDefinition[];
  isSubRegistro?: boolean;
};
const AgregarRegistros = memo(function AgregarRegistros({
  cliente,
  registerType,
  customFields = [],
  isSubRegistro = false
}: Props) {
  const {t} = useTranslation();
  const {id} = useAppSelector(selectUser);
  const selectedRegistros = useAppSelector(selectSelectedRows);
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {isOpen, toggle} = useTogglev2();
  const {addRegistro, isSavingRegistro} = useAgregarRegistros(cliente, registerType);

  const customDefaults = useMemo(() => {
    return getCustomDefaults(customFields);
  }, [customFields]);

  const prioridadLabels = {
    [REGISTRO_PRIORIDAD.BAJA]: t('clientes.registros.filter.priority.low'),
    [REGISTRO_PRIORIDAD.MEDIA]: t('clientes.registros.filter.priority.medium'),
    [REGISTRO_PRIORIDAD.ALTA]: t('clientes.registros.filter.priority.high'),
    [REGISTRO_PRIORIDAD.SINPRIORIDAD]: t('clientes.registros.filter.priority.no_priority')
  };

  const estadoLabels = {
    [REGISTRO_STATUS.ENPROGRESO]: t('clientes.registros.filter.status.in_progress'),
    [REGISTRO_STATUS.PAUSA]: t('clientes.registros.filter.status.on_hold'),
    [REGISTRO_STATUS.ENTREGADO]: t('clientes.registros.filter.status.delivered'),
    [REGISTRO_STATUS.COMPLETADO]: t('clientes.registros.filter.status.completed')
  };

  const usersToAssignRegister: Option[] = useMemo(() => {
    const defaultSinAsignar = [{value: REGISTRO_ASSIGNMENT.SINASIGNAR, label: 'Sin Asignar'}];
    if (users.length === 0) return defaultSinAsignar;
    const employeesOptions = users
      .filter((u: Employee) => {
        const canBeAssigned = hasPermission(
          PERMISOS_MAP_IDS.asignarRegistros,
          u.roles,
          u.permisosOtorgados,
          u.permisosDenegados
        );
        return canBeAssigned && u.id !== id;
      })
      .map((u: Employee) => ({value: u.id, label: getNombreCompletoUser(u)}));
    return [...defaultSinAsignar, ...employeesOptions];
  }, [users, id]);

  const parentRegistro = useMemo(() => selectedRegistros[0], [selectedRegistros]);

  const modalHeaderCopy = useMemo(() => {
    if (isSubRegistro) return `Agregar subregistro a ${cliente} - ${registerType} - ${parentRegistro?.nombre}`;
    return `Agregar registro a ${cliente} - ${registerType}`;
  }, [cliente, isSubRegistro, parentRegistro?.nombre, registerType]);

  return (
    <>
      <Button
        className="font-14 px-2"
        variant={isSubRegistro ? 'outline-warning' : 'outline-success'}
        onClick={toggle}
        disabled={isSubRegistro && !(selectedRegistros.length === 1)}>
        <span className="d-none d-md-inline">
          {t(isSubRegistro ? 'clientes.subregistro.add' : 'clientes.registros.add')}
        </span>
        <i className="d-inline d-md-none mdi mdi-plus-circle-outline" />
      </Button>
      <GenericModal
        show={isOpen}
        onToggle={toggle}
        size="lg"
        showFooter={false}
        variant={isSubRegistro ? 'warning' : 'success'}
        headerText={modalHeaderCopy}
        body={
          <SimpleBar style={{maxHeight: '700px', width: '100%', overflowX: 'hidden'}}>
            <HookForm<RegistrosCrearFormFields & Record<string, any>>
              schema={registrosCrearSchema}
              defaultValues={customDefaults}
              onSubmit={async (values) => {
                if (isSubRegistro)
                  await addRegistro({...values, isSubRegistro: true, parentRegistroId: parentRegistro?.id});
                else await addRegistro(values);
                toggle();
              }}
              isDisabled={isSavingRegistro}
              isLoading={isSavingRegistro}
              styles={{overflowX: 'hidden'}}>
              <HookInputField xs={12} md={6} name="requestAt" label="Fecha de solicitud" type="date" bottomMargin={1} />
              <HookInputField
                xs={12}
                md={6}
                name="deliverAt"
                label="Fecha de entrega"
                type="datetime-local"
                bottomMargin={1}
              />
              <HookInputField xs={12} name="nombre" label="Nombre del proyecto" type="text" bottomMargin={1} />
              <HookInputField xs={12} name="cliente" label="Cliente" type="text" bottomMargin={1} />
              <HookInputField xs={12} name="solicitante" label="Solicitante" type="text" bottomMargin={1} />
              <HookInputField
                xs={12}
                name="numeroOrden"
                label="Número de orden o de factura"
                type="text"
                bottomMargin={1}
              />
              <HookInputField xs={12} name="link" label="Link" type="url" bottomMargin={1} />
              <HookSelectField
                xs={12}
                md={6}
                name="prioridad"
                label="Prioridad"
                bottomMargin={1}
                options={Object.values(REGISTRO_PRIORIDAD).map((p) => ({value: p, label: prioridadLabels[p]}))}
              />
              <HookSelectField
                xs={12}
                md={6}
                name="estado"
                label="Estado"
                bottomMargin={1}
                options={Object.values(REGISTRO_STATUS).map((p) => ({value: p, label: estadoLabels[p]}))}
              />
              <HookSelectField
                xs={12}
                disabled={isLoadingUsers}
                isLoadingOptions={isLoadingUsers}
                name="encargado"
                label="Encargado"
                bottomMargin={1}
                options={usersToAssignRegister}
              />
              <HookInputField
                xs={12}
                name="comentarios"
                label="Comentarios u observaciones"
                as="textarea"
                rows={3}
                bottomMargin={1}
              />
              <Col>
                <hr />
              </Col>
              {customFields.map((field, i) => (
                <Fragment key={`${i}-${field.key}`}>
                  {field.type === CUSTOM_FIELD_TYPE.BOOLEAN && (
                    <HookSwitchField
                      xs={12}
                      name={field.key}
                      label={capitalizeFirstLetter(field.key)}
                      bottomMargin={1}
                    />
                  )}
                  {field.type === CUSTOM_FIELD_TYPE.SELECT && (
                    <HookSelectField
                      xs={12}
                      name={field.key}
                      label={capitalizeFirstLetter(field.key)}
                      bottomMargin={1}
                      options={(field.options || []).map((option) => ({
                        value: option,
                        label: capitalizeFirstLetter(option)
                      }))}
                    />
                  )}
                  {(field.type === CUSTOM_FIELD_TYPE.NUMBER || field.type === CUSTOM_FIELD_TYPE.STRING) && (
                    <HookInputField
                      xs={12}
                      name={field.key}
                      label={field.key}
                      type={field.type === CUSTOM_FIELD_TYPE.STRING ? 'text' : field.type}
                      bottomMargin={1}
                    />
                  )}
                </Fragment>
              ))}
            </HookForm>
          </SimpleBar>
        }
      />
    </>
  );
});

export {AgregarRegistros};
