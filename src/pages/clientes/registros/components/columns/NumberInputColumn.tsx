import {memo, useCallback, useState, ChangeEvent, KeyboardEvent, MouseEvent} from 'react';
import type {Row as TableRow} from '@tanstack/react-table';
import {Registros} from '@/types';
import {Form} from 'react-bootstrap';
import useUpdateRegistros from '@/endpoints/db/registros/useUpdateRegistros';
import {useParams} from 'react-router-dom';
import {SkeletonLoader} from '@/components/SkeletonLoader';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
type Props = {row: TableRow<Registros>; registerType: string; field: keyof Registros};
const NumberInputColumn = memo(function NumberInputColumn({row, registerType, field}: Props) {
  const originalValue = row.original[field as keyof Registros] as unknown as number;
  const id = row.original.id;
  const [inputValue, setInputValue] = useState<number>(originalValue);
  const [hasClicked, setHasClicked] = useState<boolean>(false);
  const [disabledHover, setDisabledHover] = useState<boolean>(true);
  const {cliente} = useParams<{cliente: string}>();
  const {isUpdatingRegistro, updateRegistroPerClienteType} = useUpdateRegistros();
  const handleUpdate = useCallback(
    async (e: ChangeEvent<FormControlElement> | KeyboardEvent<FormControlElement> | MouseEvent<FormControlElement>) => {
      setHasClicked(false);
      const target = e.target as FormControlElement;
      if (+target.value === originalValue) return;
      if (!cliente) return;
      await updateRegistroPerClienteType(cliente, registerType, id, {[target.name]: +target.value});
    },
    [cliente, id, originalValue, registerType, updateRegistroPerClienteType]
  );
  const onMouseEnter = useCallback(() => setDisabledHover(false), []);
  const onMouseLeave = useCallback(() => setDisabledHover(true), []);
  const onClick = useCallback(() => setHasClicked(true), []);
  const onDispatchAction = useCallback(
    (e: ChangeEvent<FormControlElement> | KeyboardEvent<FormControlElement> | MouseEvent<FormControlElement>) => {
      const target = e.target as FormControlElement;
      if (hasClicked && +target.value !== originalValue) handleUpdate(e);
    },
    [handleUpdate, hasClicked, originalValue]
  );
  return (
    <div className="w-100 h-100" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {isUpdatingRegistro ? (
        <SkeletonLoader customClass="p-0 top-0 w-100" height="29px" />
      ) : (
        <Form.Control
          type="number"
          value={inputValue}
          name={field}
          disabled={disabledHover}
          onChange={(e) => setInputValue(+e.target.value)}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onDispatchAction(e);
            } else if (e.key === 'Escape') {
              setInputValue(originalValue);
              setHasClicked(false);
            }
          }}
          onMouseLeave={onDispatchAction}
          onBlurCapture={onDispatchAction}
        />
      )}
    </div>
  );
});
export default NumberInputColumn;
