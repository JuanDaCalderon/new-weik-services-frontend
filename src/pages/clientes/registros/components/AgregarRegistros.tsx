import {memo} from 'react';
import {Button} from 'react-bootstrap';
import {GenericModal} from '@/components';
import {HookForm, HookInputField, HookSelectField} from '@/components/Form2';
import {useTogglev2} from '@/hooks';
import {REGISTRO_ASSIGNMENT, REGISTRO_PRIORIDAD, REGISTRO_STATUS} from '@/types';
import {registrosCrearSchema, RegistrosCrearFormFields} from '@/pages/clientes/registros/schemas/createRegistro';
import {useAgregarRegistros} from '../hooks/useAgregarRegistros';

type Props = {
  cliente: string | undefined;
  registerType: string;
};
const AgregarRegistros = memo(function AgregarRegistros({cliente, registerType}: Props) {
  const {isOpen, toggle} = useTogglev2();
  const {addRegistro, isSavingRegistro} = useAgregarRegistros(cliente, registerType);
  const prioridadLabels = {
    [REGISTRO_PRIORIDAD.BAJA]: 'Baja',
    [REGISTRO_PRIORIDAD.MEDIA]: 'Media',
    [REGISTRO_PRIORIDAD.ALTA]: 'Alta',
    [REGISTRO_PRIORIDAD.SINPRIORIDAD]: 'Sin Prioridad'
  };
  const estadoLabels = {
    [REGISTRO_STATUS.ENPROGRESO]: 'En Progreso',
    [REGISTRO_STATUS.PAUSA]: 'En Pausa',
    [REGISTRO_STATUS.ENTREGADO]: 'Entregado',
    [REGISTRO_STATUS.COMPLETADO]: 'Completado'
  };
  return (
    <>
      <Button className="font-14 px-2" variant="outline-success" onClick={toggle}>
        <span className="d-none d-md-inline">Agregar</span>
        <i className="d-inline d-md-none mdi mdi-plus-circle-outline" />
      </Button>
      <GenericModal
        show={isOpen}
        onToggle={toggle}
        showFooter={false}
        variant="success"
        headerText={`Agregar registro a ${cliente} - ${registerType}`}
        body={
          <HookForm<RegistrosCrearFormFields>
            schema={registrosCrearSchema}
            onSubmit={async (values) => {
              await addRegistro(values);
              toggle();
            }}
            isDisabled={isSavingRegistro}
            isLoading={isSavingRegistro}>
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
              name="encargado"
              label="Encargado"
              bottomMargin={1}
              options={[{value: REGISTRO_ASSIGNMENT.SINASIGNAR, label: 'Sin Asignar'}]}
            />
            <HookInputField
              xs={12}
              name="comentarios"
              label="Comentarios u observaciones"
              as="textarea"
              rows={3}
              bottomMargin={1}
            />
          </HookForm>
        }
      />
    </>
  );
});

export {AgregarRegistros};
