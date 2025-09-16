import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { compareValues } from '../../../../../shared/validators/values.validator';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TourFormBuilder {
  private static readonly IMAGE_SLOT_COUNT = 3;

  constructor(private fb: FormBuilder) {}

  buildForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(40),
        ],
      ],
      duration: ['', Validators.required],
      maxGroupSize: ['', Validators.required],
      difficulty: ['', Validators.required],
      prices: this.fb.group(
        {
          price: ['', Validators.required],
          priceDiscount: ['0'],
        },
        {
          validators: compareValues('price', 'priceDiscount', 'priceValidator'),
        },
      ),
      summary: ['', Validators.required],
      description: [''],
      imageCover: [null, Validators.required],
      images: this.initImageSlots(),
      startLocation: this.fb.group({
        startCoordinates: this.fb.group({
          lng: [''],
          lat: [''],
        }),
        startAddress: [''],
        startDescription: [''],
      }),
      startDates: this.fb.array([]),
      locations: this.fb.array([]),
      secret: [false],
      guides: this.fb.array([]),
    });
  }

  initImageSlots(count = TourFormBuilder.IMAGE_SLOT_COUNT): FormArray {
    return this.fb.array(
      Array(count)
        .fill(null)
        .map(() => this.fb.control<File | string | null>(null)),
    );
  }
}
