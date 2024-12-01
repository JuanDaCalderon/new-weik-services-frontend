import {useState} from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';

type TypeaheadOption = string | Record<string, object>;

export default function useTypeahead() {
  const [singleSelections, setSingleSelections] = useState<TypeaheadOption[]>([]);
  const [multiSelections, setMultiSelections] = useState<TypeaheadOption[]>([]);

  const options: Array<TypeaheadOption> = [
    {id: 1 as Object, value: 'chocolate' as Object, label: 'Chocolate' as Object},
    {id: 2 as Object, value: 'strawberry' as Object, label: 'Strawberry' as Object},
    {id: 3 as Object, value: 'vanilla' as Object, label: 'Vanilla' as Object}
  ];

  const onChangeSingleSelection = (selected: TypeaheadOption[]) => {
    setSingleSelections(selected);
  };

  const onChangeMultipleSelection = (selected: TypeaheadOption[]) => {
    setMultiSelections(selected);
  };

  return {
    options,
    singleSelections,
    multiSelections,
    onChangeSingleSelection,
    onChangeMultipleSelection
  };
}
