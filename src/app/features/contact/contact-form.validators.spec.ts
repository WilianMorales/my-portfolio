import { FormControl } from '@angular/forms';
import {
  emailFormatValidator,
  minLengthTrimmedValidator,
  noWhitespaceValidator,
  NO_SQL_INJECTION_REGEX
} from './contact-form.validators';

describe('emailFormatValidator', () => {
  it('debe devolver null cuando el email tiene un formato válido', () => {
    const control = new FormControl('persona@dominio.com');
    expect(emailFormatValidator(control)).toBeNull();
  });

  it('debe devolver { emailInvalid: true } cuando el email no tiene un formato válido', () => {
    const control = new FormControl('persona-arroba-dominio');
    expect(emailFormatValidator(control)).toEqual({ emailInvalid: true });
  });

  it('debe devolver null cuando el valor está vacío (delegar required a otro validador)', () => {
    const control = new FormControl('');
    expect(emailFormatValidator(control)).toBeNull();
  });
});

describe('minLengthTrimmedValidator', () => {
  const validator = minLengthTrimmedValidator(10);

  it('debe devolver { minLength: true } si el texto recortado es menor al mínimo', () => {
    const control = new FormControl('   hola   ');
    expect(validator(control)).toEqual({ minLength: true });
  });

  it('debe devolver null si el texto recortado alcanza el mínimo', () => {
    const control = new FormControl('  este mensaje es suficientemente largo  ');
    expect(validator(control)).toBeNull();
  });

  it('debe tratar un valor nulo o indefinido como cadena vacía', () => {
    const control = new FormControl(null);
    expect(validator(control)).toEqual({ minLength: true });
  });
});

describe('noWhitespaceValidator', () => {
  it('debe devolver { whitespace: true } si el valor son solo espacios', () => {
    const control = new FormControl('     ');
    expect(noWhitespaceValidator(control)).toEqual({ whitespace: true });
  });

  it('debe devolver null si el valor tiene contenido real', () => {
    const control = new FormControl('  hola mundo  ');
    expect(noWhitespaceValidator(control)).toBeNull();
  });

  it('debe devolver { whitespace: true } si el valor es nulo', () => {
    const control = new FormControl(null);
    expect(noWhitespaceValidator(control)).toEqual({ whitespace: true });
  });
});

describe('NO_SQL_INJECTION_REGEX', () => {
  it('debe permitir un mensaje normal sin coincidir con el patrón prohibido', () => {
    expect(NO_SQL_INJECTION_REGEX.test('Hola, quiero contactarte por un proyecto')).toBe(true);
  });

  it.each(['select * from users', 'DROP TABLE users', '<script>alert(1)</script>', 'a; delete b'])(
    'debe rechazar mensajes con palabras/patrones peligrosos: %s',
    (valor: string) => {
      expect(NO_SQL_INJECTION_REGEX.test(valor)).toBe(false);
    }
  );
});
