import { FormGroup } from '@angular/forms';

export function validateForm(form: FormGroup): boolean {
  form.updateValueAndValidity();
  if (!form.invalid) {
    return true;
  }
  const controls = form.controls;
  for (const controlName in controls) {
    if (!controls.hasOwnProperty(controlName)) {
      continue;
    }
    const control = controls[controlName];
    if (!control) {
      continue;
    }
    if (control.errors) {
      control.markAsTouched();
    }
  }
  return false;
}
