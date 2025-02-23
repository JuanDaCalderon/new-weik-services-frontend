import {useState} from 'react';

export default function useDatePicker(rangeInit: boolean = true) {
  const initialDate = new Date();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([rangeInit ? initialDate : null, null]);

  const onDateChangeRange = (newRange: any) => {
    if (newRange) setDateRange(newRange);
  };

  const resetDateRange = () => setDateRange([rangeInit ? initialDate : null, null]);

  return {
    dateRange,
    onDateChangeRange,
    resetDateRange
  };
}
