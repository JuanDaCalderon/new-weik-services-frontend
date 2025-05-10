import {EmployeeWithFilterDate} from '@/types';
import {memo} from 'react';

const Retroalimentacion = memo(function Retroalimentacion({employee}: {employee: EmployeeWithFilterDate}) {
  console.log('🚀 ~ Retroalimentacion ~ employee:', employee);
  return <span>Retroalimentacion</span>;
});

export {Retroalimentacion};
