import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const group = control as FormGroup;
  const password = group.get('password')?.value ?? '';
  const confirm  = group.get('confirmPassword')?.value ?? '';
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
};
