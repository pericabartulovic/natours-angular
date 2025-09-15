import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class TourFormBuildPayload {
  buildPayload(
    form: FormGroup,
    coverFile: File | undefined,
    guidesArray: FormArray,
  ): FormData {
    const fv = form.value;
    const formData = new FormData();

    // Basic fields
    [
      'name',
      'duration',
      'difficulty',
      'maxGroupSize',
      'secret',
      'summary',
      'description',
    ].forEach((key) => {
      formData.append(key, fv[key]);
    });

    // Price
    formData.append('price', fv.prices.price);
    formData.append('priceDiscount', fv.prices.priceDiscount);

    // Cover image
    if (coverFile) {
      formData.append('imageCover', coverFile);
    } else if (fv.imageCover) {
      formData.append('imageCover', fv.imageCover);
    }

    // Images
    const fileIndexes: number[] = [];

    fv.images.forEach((img: File | string | null, i: number) => {
      if (img instanceof File) {
        fileIndexes.push(i);
      }
    });

    // Append the index metadata as JSON string
    formData.append('imagesIndexes', JSON.stringify(fileIndexes));

    // Append images normally, order doesn't matter as long as backend uses indexes
    fv.images.forEach((img: File | string | null, i: number) => {
      if (img instanceof File) {
        formData.append('images', img);
      } else if (typeof img === 'string' && img.length > 0) {
        formData.append('images', img);
      } else {
        formData.append('images', ''); // empty slot
      }
    });

    // Dates
    const formattedDates = this.formatDates(fv.startDates);
    formattedDates?.forEach((date) => formData.append('startDates', date));

    // Guides
    console.log('Guide payload:', guidesArray.value);
    guidesArray.value.forEach((g: any) => {
      if (g._id) formData.append('guides', g._id);
    });

    // Locations — send as objects, not JSON strings
    fv.locations.forEach((loc: any, i: number) => {
      formData.append(`locations[${i}][type]`, 'Point');
      formData.append(`locations[${i}][coordinates][]`, loc.coordinates.lng);
      formData.append(`locations[${i}][coordinates][]`, loc.coordinates.lat);
      formData.append(`locations[${i}][description]`, loc.description || '');
      formData.append(`locations[${i}][day]`, loc.day);
    });

    // Start location
    formData.append('startLocation[type]', 'Point');
    formData.append(
      'startLocation[coordinates][]',
      fv.startLocation.startCoordinates.lng,
    );
    formData.append(
      'startLocation[coordinates][]',
      fv.startLocation.startCoordinates.lat,
    );
    formData.append(
      'startLocation[address]',
      fv.startLocation.startAddress || '',
    );
    formData.append(
      'startLocation[description]',
      fv.startLocation.startDescription || '',
    );

    return formData;
  }

  private formatDates(dates: any[] = []): string[] | undefined {
    if (!dates.length) return [];
    return dates
      .map((d) => d.date)
      .filter(Boolean)
      .map((d) => new Date(d).toISOString());
  }
}
