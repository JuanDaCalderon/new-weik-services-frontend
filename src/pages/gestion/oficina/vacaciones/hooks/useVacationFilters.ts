import {useCallback, useState, ChangeEvent} from 'react';

export default function useVacationFilters() {
  const [isCheckedOnlyMyVacations, setIsCheckedOnlyMyVacations] = useState(false);
  const [isCheckedPendingVacations, setIsCheckedPendingVacations] = useState(false);

  const handleSwitchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsCheckedOnlyMyVacations(e.target.checked);
  }, []);

  const handleSwitchChangePendingVacations = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsCheckedPendingVacations(e.target.checked);
    setIsCheckedOnlyMyVacations(false);
  }, []);

  return {
    isCheckedOnlyMyVacations,
    isCheckedPendingVacations,
    handleSwitchChange,
    handleSwitchChangePendingVacations
  };
}
