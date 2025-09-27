import { InjectionToken } from '@angular/core';

export const FORM_ERROR_MESSAGES = new InjectionToken<Record<string, string>>(
  'FORM_ERROR_MESSAGES',
);

export const defaultErrorMessages = {
  required: 'This field is required',
  minlength: 'Too short',
  maxlength: 'Too long',
  email: 'Invalid email format',
  notGreater: 'Discount must be lower than price',
  valuesNotEqual: 'Passwords must match',
};
