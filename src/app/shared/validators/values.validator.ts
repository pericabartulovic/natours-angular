import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// multi-input validators factory
export function compareValues(
  controlName1: string,
  controlName2: string,
  type: string,
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const val1 = formGroup.get(controlName1)?.value;
    const val2 = formGroup.get(controlName2)?.value;

    const elToCheck = formGroup.get(controlName2);

    if (val1 == null || val2 == null) return null;

    if (type === 'passValidator' && val1 !== val2) {
      elToCheck!.setErrors({ valuesNotEqual: true });
      return { valuesNotEqual: true };
    } else if (
      type === 'priceValidator' &&
      val1 != null &&
      val2 != null &&
      val1 <= val2
    ) {
      elToCheck!.setErrors({ notGreater: true });
      return { notGreater: true };
    } else {
      if (elToCheck!.hasError('valuesNotEqual')) {
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
