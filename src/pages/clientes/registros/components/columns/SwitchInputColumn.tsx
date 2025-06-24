import {memo, useCallback, useState, ChangeEvent} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';
import {Form} from 'react-bootstrap';
import useUpdateRegistros from '@/endpoints/db/registros/useUpdateRegistros';
import {useParams} from 'react-router-dom';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {useTranslation} from 'react-i18next';

type FormControlElement = HTMLInputElement;
type Props = {row: TableRow<Registros>; registerType: string; field: keyof Registros};
const SwitchInputColumn = memo(function SwitchInputColumn({row, registerType, field}: Props) {
  const originalValue = row.original[field as keyof Registros] as unknown as boolean;
  const id = row.original.id;
  const [switchValue, setSwitchValue] = useState<boolean>(originalValue);
  const [disabledHover, setDisabledHover] = useState<boolean>(true);
  const {cliente} = useParams<{cliente: string}>();
  const {isUpdatingRegistro, updateRegistroPerClienteType} = useUpdateRegistros();
  const {t} = useTranslation();
  const onMouseEnter = useCallback(() => setDisabledHover(false), []);
  const onMouseLeave = useCallback(() => setDisabledHover(true), []);
  const onDispatchAction = useCallback(
    async (e: ChangeEvent<FormControlElement>) => {
      const target = e.target as FormControlElement;
      setSwitchValue(target.checked);
      if (!cliente) return;
      await updateRegistroPerClienteType(cliente, registerType, id, {[target.name]: target.checked});
    },
    [cliente, id, registerType, updateRegistroPerClienteType]
  );
  return (
    <div className="w-100 h-100" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {isUpdatingRegistro ? (
        <SkeletonLoader customClass="p-0 top-0 w-100" height="29px" />
      ) : (
        <>
          <Form.Check
            className="cursor-pointer"
            type="switch"
            name={field}
            disabled={disabledHover}
            label={switchValue ? t('yes') : t('no')}
            checked={switchValue}
            onChange={(e) => onDispatchAction(e)}
          />
        </>
      )}
    </div>
  );
});
export default SwitchInputColumn;
