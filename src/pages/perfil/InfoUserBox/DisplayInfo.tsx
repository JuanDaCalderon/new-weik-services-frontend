import {DisplayInfoProps} from '@/types';
import {memo} from 'react';

const DisplayInfo = ({label, value = 'Información no disponible', className = ''}: DisplayInfoProps) => (
  <p className={`text-dark ${className}`}>
    <strong>{label}:</strong>
    <span className="ms-2 text-dark text-opacity-75">{value}</span>
  </p>
);

export default memo(DisplayInfo);
