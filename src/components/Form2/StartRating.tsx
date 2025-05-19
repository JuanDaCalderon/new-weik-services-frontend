import {useState} from 'react';
import {Form} from 'react-bootstrap';

type StarRatingProps = {
  value: 0 | 1 | 2 | 3 | 4 | 5;
  onChange?: (star: 0 | 1 | 2 | 3 | 4 | 5) => void;
  disabled?: boolean;
};
export const StarRating = ({value, onChange = () => {}, disabled = false}: StarRatingProps) => {
  const [hover, setHover] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const activeValue = !disabled && hover > 0 ? hover : value;
  return (
    <Form.Group>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`mdi mdi-star font-24 ${
            activeValue >= star ? 'text-warning' : 'text-secondary'
          } ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => {
            if (!disabled) onChange(star as 0 | 1 | 2 | 3 | 4 | 5);
          }}
          onMouseEnter={() => {
            if (!disabled) setHover(star as 0 | 1 | 2 | 3 | 4 | 5);
          }}
          onMouseLeave={() => {
            if (!disabled) setHover(0);
          }}
        />
      ))}
    </Form.Group>
  );
};
