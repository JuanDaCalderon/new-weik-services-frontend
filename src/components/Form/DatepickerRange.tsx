import React, {forwardRef, useMemo} from 'react';
import DatePicker, {registerLocale} from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.min.css';

registerLocale('es', es);

interface DatepickerInputProps {
  onClick?: () => void;
  value?: string;
  inputClass?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  name?: string;
}

/* Datepicker with Input */
const DatepickerInput = forwardRef<HTMLInputElement, DatepickerInputProps>(function DatepickerInput(
  {inputClass = '', disabled = false, name = '', onClick = () => {}, value = ''}: DatepickerInputProps,
  ref
) {
  return (
    <input
      disabled={disabled}
      type="text"
      className={`form-control date cursor-text ${inputClass}`}
      onClick={onClick}
      value={value}
      onChange={() => {}}
      ref={ref}
      name={name}
    />
  );
});

/* Datepicker with Addon Input */
const DatepickerInputWithAddon = forwardRef<HTMLInputElement, DatepickerInputProps>(function DatepickerInputWithAddon(
  {inputClass = '', disabled = false, name = '', onClick = () => {}, value = ''}: DatepickerInputProps,
  ref
) {
  return (
    <div className="input-group" ref={ref}>
      <input
        disabled={disabled}
        type="text"
        className={`form-control form-control-light ${inputClass}`}
        onClick={onClick}
        value={value}
        name={name}
        readOnly
      />
      <div className="input-group-append">
        <span className="input-group-text bg-primary border-primary text-white">
          <i className="mdi mdi-calendar-range font-13"></i>
        </span>
      </div>
    </div>
  );
});

type HyperDatepickerProps = {
  onChange: (date: Date) => void;
  hideAddon?: boolean;
  inputClass?: string;
  dateFormat?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  isRange: boolean;
  startDate: Date | null;
  endDate: Date | null;
  monthsShown?: number;
  inline?: boolean;
  disabledDates?: Date[];
  highlightDates?: Date[];
};

const DatepickerRange = (props: HyperDatepickerProps) => {
  const input = useMemo(() => {
    if ((props.hideAddon || false) === true) {
      return <DatepickerInput name={props.name} inputClass={props.inputClass ?? ''} />;
    } else {
      <DatepickerInputWithAddon name={props.name} inputClass={props.inputClass ?? ''} />;
    }
  }, [props.hideAddon, props.inputClass, props.name]);

  return (
    <>
      {/* date picker control */}
      <DatePicker
        disabled={props.disabled ?? false}
        customInput={input}
        className={`form-control ${props.inputClass}`}
        onChange={(date: Date) => props.onChange(date)}
        dateFormat={props.dateFormat ?? 'dd/MM/yyyy'}
        name={props.name}
        selectsRange={props.isRange}
        startDate={props.startDate}
        endDate={props.endDate}
        monthsShown={props.monthsShown ?? 2}
        inline={props.inline}
        excludeDates={props.disabledDates ? props.disabledDates : []}
        calendarClassName="calendar-with-divider"
        locale={es}
      />
    </>
  );
};

export default DatepickerRange;
