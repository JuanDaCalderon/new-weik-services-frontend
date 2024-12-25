import {ReactNode} from 'react';

export type LabelProps = {
  label: string | ReactNode;
  htmlFor?: string;
};

export type FeedbackInvalidProps = {
  errorMessage: string;
  customClassNames?: string;
};
