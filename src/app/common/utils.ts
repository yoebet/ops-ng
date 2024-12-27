import { FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';

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


export function parseDateTimeUtc(dateStr: string): DateTime {
  if (dateStr.includes('T')) {
    return DateTime.fromISO(dateStr);
  }
  // https://moment.github.io/luxon/#/parsing?id=table-of-tokens
  let pattern = 'yyyy-MM-dd';
  if (dateStr.includes(':')) {
    pattern = `${pattern} HH:mm`;
  }
  return DateTime.fromFormat(dateStr, pattern, {
    zone: 'UTC',
  });
}

export function extractDate(date: string | DateTime): string {
  // yyyy-MM-dd
  if (typeof date === 'string') {
    return date.substring(0, 10);
  }
  return date.toISODate();
}
