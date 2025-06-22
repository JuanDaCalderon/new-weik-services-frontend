import {memo, useCallback, useState, ChangeEvent, MouseEvent, useMemo} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Option, Registros} from '@/types';
import {Form} from 'react-bootstrap';
import useUpdateRegistros from '@/endpoints/db/registros/useUpdateRegistros';
import {useParams} from 'react-router-dom';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {REGISTRO_PRIORIDAD, REGISTRO_STATUS} from '@/constants';

type FormControlElement = HTMLSelectElement;
type Props = {
  row: TableRow<Registros>;
  registerType: string;
  field: keyof Registros;
  options: Option[];
};
const SelectInputColumn = memo(function SelectInputColumn({row, registerType, field, options}: Props) {
  const originalValue = row.original[field] as string;
  const id = row.original.id;
  const [selectValue, setSelectValue] = useState<string>(originalValue);
  const [hasClicked, setHasClicked] = useState<boolean>(false);
  const [disabledHover, setDisabledHover] = useState<boolean>(true);
  const {cliente} = useParams<{cliente: string}>();
  const {isUpdatingRegistro, updateRegistroPerClienteType} = useUpdateRegistros();
  const handleUpdate = useCallback(
    async (e: ChangeEvent<FormControlElement> | MouseEvent<FormControlElement>) => {
      setHasClicked(false);
      const target = e.target as FormControlElement;
      if (target.value === originalValue) return;
      if (!cliente) return;
      await updateRegistroPerClienteType(cliente, registerType, id, {[target.name]: target.value});
    },
    [cliente, id, originalValue, registerType, updateRegistroPerClienteType]
  );
  const onMouseEnter = useCallback(() => setDisabledHover(false), []);
  const onMouseLeave = useCallback(() => setDisabledHover(true), []);
  const onClick = useCallback(() => setHasClicked(true), []);
  const onDispatchAction = useCallback(
    (e: ChangeEvent<FormControlElement> | MouseEvent<FormControlElement>) => {
      const target = e.target as FormControlElement;
      if (hasClicked && target.value !== originalValue) handleUpdate(e);
    },
    [handleUpdate, hasClicked, originalValue]
  );

  const selectClassName = useMemo(() => {
    const valueToClass: Record<string, string> = {
      [REGISTRO_STATUS.ENTREGADO]: 'border-success',
      [REGISTRO_STATUS.COMPLETADO]: 'border-primary',
      [REGISTRO_STATUS.PAUSA]: 'border-danger',
      [REGISTRO_STATUS.ENPROGRESO]: 'border-warning',
      [REGISTRO_PRIORIDAD.ALTA]: 'border-danger',
      [REGISTRO_PRIORIDAD.MEDIA]: 'border-warning',
      [REGISTRO_PRIORIDAD.BAJA]: 'border-primary'
    };
    return valueToClass[selectValue] ?? '';
  }, [selectValue]);

  return (
    <div className="w-100 h-100" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {isUpdatingRegistro ? (
        <SkeletonLoader customClass="p-0 top-0 w-100" height="29px" />
      ) : (
        <Form.Select
          className={selectClassName}
          value={selectValue}
          name={field}
          disabled={disabledHover}
          onChange={(e) => {
            setSelectValue(e.target.value);
            onDispatchAction(e);
          }}
          onClick={onClick}
          onBlurCapture={onDispatchAction}>
          {options.map(({value, label}) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Form.Select>
      )}
    </div>
  );
});
export default SelectInputColumn;
