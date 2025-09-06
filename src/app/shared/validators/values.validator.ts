import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// multi-input validators factory
export function equalValues(
  controlName1: string,
  controlName2: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    return val1 === val2 ? null : { valuesNotEqual: true };
  };
}

export function valueGreaterThan(
  controlName1: string,
  controlName2: string,
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const val1 = formGroup.get(controlName1)?.value;
    const val2 = formGroup.get(controlName2)?.value;

    //el to set error to:
    const elToCheck = formGroup.get(controlName2);

    if (val1 == null || val2 == null) return null;

    if (val1 != null && val2 != null && val1 <= val2) {
      // ❌ set error on discount field
      elToCheck!.setErrors({ notGreater: true });
      return { notGreater: true };
    } else {
      // ✅ clear error if condition passes
      if (elToCheck!.hasError('notGreater')) {
        elToCheck!.setErrors(null);
        elToCheck!.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false,
        });
      }
      return null;
    }
  };
}
