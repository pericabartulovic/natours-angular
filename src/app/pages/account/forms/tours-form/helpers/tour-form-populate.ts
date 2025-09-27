import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Tour } from '../../../../../models/tour.model';

@Injectable({ providedIn: 'root' })
export class TourFormPopulate {
  private static readonly IMAGE_SLOT_COUNT = 3;

  constructor(private fb: FormBuilder) {}

  populateGeneralInputs(form: FormGroup, tour: Tour) {
    form.patchValue({
      name: tour.name,
      duration: tour.duration,
      difficulty: tour.difficulty,
      maxGroupSize: tour.maxGroupSize,
      prices: {
        price: tour.price,
        priceDiscount: tour.priceDiscount,
      },
      secret: tour.secretTour,
      summary: tour.summary,
      description: tour.description,
      imageCover: tour.imageCover,
      startLocation: {
        startCoordinates: {
          lng: tour.startLocation.coordinates[0],
          lat: tour.startLocation.coordinates[1],
        },
        startAddress: tour.startLocation.address,
        startDescription: tour.startLocation.description,
      },
    });
  }

  populateImages(
    form: FormGroup,
    tour: Tour,
    imagePreviews: { [key: number]: string | ArrayBuffer | null },
  ): { imagePreviews: typeof imagePreviews; coverPreview: string | null } {
    const coverPreview = tour.imageCover
      ? `http://localhost:3000/img/tours/${tour.imageCover}`
      : null;
    const imagesArray = form.get('images') as FormArray;
    // NOTE: in TypeScript/JavaScript, function arguments are passed by value (for primitives)
    // or by reference (for objects) — reassigning the parameter to '{}'
    // breaks the link to the original this.imagePreviews.
    Object.keys(imagePreviews).forEach((key) => delete imagePreviews[+key]);

    // Rebuild images array to always have exactly 3 slots; ensure correct length
    while (imagesArray.length < TourFormPopulate.IMAGE_SLOT_COUNT) {
      imagesArray.push(this.fb.control<File | string | null>(null));
    }

    tour.images.forEach((img, i) => {
      if (i < TourFormPopulate.IMAGE_SLOT_COUNT) {
        imagePreviews[i] = `http://localhost:3000/img/tours/${img}`;
        imagesArray.at(i).setValue(img);
      }
    });
    return { imagePreviews, coverPreview };
  }

  populateLocations(tour: Tour, locations: FormArray) {
    locations.clear();
    tour.locations.forEach((loc) => {
      locations.push(
        this.fb.group({
          coordinates: this.fb.group({
            lng: loc.coordinates[0],
            lat: loc.coordinates[1],
          }),
          description: loc.description,
          day: loc.day,
        }),
      );
    });
  }

  populateDates(tour: Tour, startDates: FormArray) {
    startDates.clear();

    tour.startDates.forEach((sd) => {
      const formatted = new Date(sd).toISOString().split('T')[0];
      startDates.push(
        this.fb.group({
          date: formatted,
        }),
      );
    });
  }

  populateGuides(form: FormGroup, tour: Tour) {
    const guidesArray = form.get('guides') as FormArray;

    guidesArray.clear();

    tour.guides.forEach((g) => {
      guidesArray.push(
        this.fb.group({
          _id: [g._id],
          name: [g.name],
          email: [g.email],
          photo: [g.photo],
          role: [g.role],
        }),
      );
    });
  }
}
