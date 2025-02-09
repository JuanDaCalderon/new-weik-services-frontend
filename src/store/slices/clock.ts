import {createSlice} from '@reduxjs/toolkit';
import {
  IS_IN_WORKING_TIME_LOCALSTORAGE_KEY,
  HAS_CHECKIN_LOCALSTORAGE_KEY,
  HAS_CHECKOUT_LOCALSTORAGE_KEY
} from '@/constants';
import {CLOCK_IN_CLOCK_OUT_NAME} from '@/constants';
import {clockInOutData} from '@/types';

const isInWorkingTime: boolean = localStorage.getItem(IS_IN_WORKING_TIME_LOCALSTORAGE_KEY)
  ? localStorage.getItem(IS_IN_WORKING_TIME_LOCALSTORAGE_KEY) === 'true'
  : false;
const hasCheckIn: boolean = localStorage.getItem(HAS_CHECKIN_LOCALSTORAGE_KEY)
  ? localStorage.getItem(HAS_CHECKIN_LOCALSTORAGE_KEY) === 'true'
  : false;
const hasCheckOut: boolean = localStorage.getItem(HAS_CHECKOUT_LOCALSTORAGE_KEY)
  ? localStorage.getItem(HAS_CHECKOUT_LOCALSTORAGE_KEY) === 'true'
  : false;

const initialState: clockInOutData = {isInWorkingTime, hasCheckIn, hasCheckOut};

export const clockSlice = createSlice({
  name: CLOCK_IN_CLOCK_OUT_NAME,
  initialState,
  reducers: {
    setCheckIn: (state: clockInOutData) => {
      // Hace Check-in empieza el contador de horas de trabajo
      localStorage.setItem(IS_IN_WORKING_TIME_LOCALSTORAGE_KEY, 'true');
      localStorage.setItem(HAS_CHECKIN_LOCALSTORAGE_KEY, 'true');
      return {...state, isInWorkingTime: true, hasCheckIn: true};
    },
    setCheckOut: (state: clockInOutData) => {
      // hizo checkout - Ya no esta en horario de trabajo
      localStorage.setItem(IS_IN_WORKING_TIME_LOCALSTORAGE_KEY, 'false');
      localStorage.setItem(HAS_CHECKOUT_LOCALSTORAGE_KEY, 'true');
      return {...state, isInWorkingTime: false, hasCheckOut: true};
    },
    setResetTimeFlags: (state: clockInOutData) => {
      localStorage.removeItem(IS_IN_WORKING_TIME_LOCALSTORAGE_KEY);
      localStorage.removeItem(HAS_CHECKIN_LOCALSTORAGE_KEY);
      localStorage.removeItem(HAS_CHECKOUT_LOCALSTORAGE_KEY);
      return {...state, hasCheckIn: false, hasCheckOut: false, isInWorkingTime: false};
    }
  }
});

export const {setCheckIn, setCheckOut, setResetTimeFlags} = clockSlice.actions;
export default clockSlice.reducer;
