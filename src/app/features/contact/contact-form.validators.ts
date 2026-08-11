import { AbstractControl, ValidationErrors } from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const NO_SQL_INJECTION_REGEX =
  /^(?!.*\b(script|select|insert|delete|update|drop|--|;)\b).*$/i;

export function emailFormatValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  if (email && !EMAIL_REGEX.test(email)) {
    return { emailInvalid: true };
  }
  return null;
}

export function minLengthTrimmedValidator(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    if (value.trim().length < min) {
      return { minLength: true };
    }
    return null;
  };
}

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').toString();
  const isWhitespace = value.trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
}
