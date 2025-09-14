import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, skip } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { TourService } from '../../../../services/tour.service';
import { Tour } from '../../../../models/tour.model';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { ControlErrorDirective } from '../../../../shared/control-error/control-error.directive';
import {
  FORM_ERROR_MESSAGES,
  defaultErrorMessages,
} from '../../../../shared/control-error/form-errors';
import { NotificationService } from '../../../../services/notification.service';
import { TourFormBuilder } from './helpers/tour-from-builder';
import { TourFormPopulate } from './helpers/tour-form-populate';

@Component({
  selector: 'app-tours-form',
  imports: [ReactiveFormsModule, AsyncPipe, ControlErrorDirective],
  providers: [{ provide: FORM_ERROR_MESSAGES, useValue: defaultErrorMessages }],
  templateUrl: './tours-form.component.html',
  styleUrls: ['./tours-form.component.scss'],
})
export class ToursFormComponent implements OnInit {
  private static readonly IMAGE_SLOT_COUNT = 3;
  form!: FormGroup;
  user$!: Observable<User | null>;
  guides$!: Observable<User[] | null>;
  tourId: string | null = '';
  startLocation!: FormGroup;
  coverFile?: File;
  coverPreview: string | ArrayBuffer | null = null;
  imagePreviews: { [key: number]: string | ArrayBuffer | null } = {};
  guideSelectControl!: FormControl;

  constructor(
    public authService: AuthService,
    public tourService: TourService,
    public userService: UserService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private destroyRef: DestroyRef,
    private formHelper: TourFormBuilder,
    private formPopulate: TourFormPopulate,
  ) {
    this.user$ = this.authService.user$;
    this.guides$ = this.userService.guides$;
    this.tourId = this.activatedRoute.snapshot.paramMap.get('tourId');
  }

  ngOnInit() {
    this.userService.getGuides();
    this.form = this.formHelper.buildForm();
    this.guideSelectControl = this.fb.control<any>(null);

    if (!this.isEditMode) {
      this.locations.push(this.createLocationGroup());
      this.startDates.push(this.createStartDatesGroup());
    }

    if (this.tourId) {
      this.tourService.getTourById(this.tourId);
      const subscription = this.tourService.tour$.pipe(skip(1)).subscribe({
        next: (tour) => {
          if (tour) {
            this.formPopulate.populateGeneralInputs(this.form, tour);
            this.coverPreview = `http://localhost:3000/img/tours/${tour.imageCover}`;
            this.formPopulate.populateImages(
              this.form,
              tour,
              this.imagePreviews,
            );
            this.formPopulate.populateLocations(tour, this.locations);
            this.formPopulate.populateDates(tour, this.startDates);
            this.formPopulate.populateGuides(this.form, tour);
          }
        },
      });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }

  // Images upload
  onFileSelected(event: Event, type: 'cover' | number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (type === 'cover') {
        this.coverPreview = reader.result;
        this.coverFile = file;
        this.form.get('imageCover')?.setValue(file);
      } else {
        const idx = Number(type);
        if (idx < 0 || idx >= ToursFormComponent.IMAGE_SLOT_COUNT) return;

        this.imagePreviews[idx] = reader.result;

        const imagesArray = this.form.get('images') as FormArray;
        // ensuring that slot exists, so called defensive approach
        while (imagesArray.length <= idx) {
          imagesArray.push(this.fb.control<File | string | null>(null));
        }
        imagesArray.at(idx).setValue(file);
      }
    };

    reader.readAsDataURL(file);
  }

  removeImage(type: 'cover' | number): void {
    if (type === 'cover') {
      this.coverPreview = null;
      this.coverFile = undefined;
      this.form.get('imageCover')?.reset();
    } else {
      const idx = Number(type);
      if (idx < 0 || idx >= ToursFormComponent.IMAGE_SLOT_COUNT) return;

      this.imagePreviews[idx] = null;
      const imagesArray = this.form.get('images') as FormArray;
      if (imagesArray.at(idx)) {
        imagesArray.at(idx).setValue('');
      }
    }
  }

  // Getter and Factory for creating a dates group
  get startDates(): FormArray {
    return this.form.get('startDates') as FormArray;
  }

  private createStartDatesGroup(): FormGroup {
    return this.fb.group({
      date: [''],
    });
  }

  addDate(): void {
    this.startDates.push(this.createStartDatesGroup());
  }

  removeDate(index: number): void {
    this.startDates.removeAt(index);
  }

  // Getter and Factory for creating a location group
  get locations(): FormArray {
    return this.form.get('locations') as FormArray;
  }

  private createLocationGroup(): FormGroup {
    return this.fb.group({
      coordinates: this.fb.group({
        lng: [''],
        lat: [''],
      }),
      description: [''],
      day: [''],
    });
  }

  addLocation(): void {
    this.locations.push(this.createLocationGroup());
  }

  removeLocation(index: number): void {
    this.locations.removeAt(index);
  }

  // Getter and Factory for Guides:
  get guidesArray(): FormArray {
    return this.form.get('guides') as FormArray;
  }

  private createGuideGroup(guide: any): FormGroup {
    return this.fb.group({
      id: [guide._id, Validators.required],
      name: [guide.name],
      email: [guide.email],
      photo: [guide.photo],
      role: [guide.role],
    });
  }

  addGuide() {
    const guide = this.guideSelectControl.value;
    if (!guide) return;

    const alreadyExists = this.guidesArray.value.some(
      (g: any) => g.id === guide._id,
    );
    if (!alreadyExists) {
      this.guidesArray.push(this.createGuideGroup(guide));
    }

    this.guideSelectControl.reset();
  }

  removeGuide(index: number) {
    this.guidesArray.removeAt(index);
  }

  get isEditMode(): boolean {
    return !!this.tourId; // true if tourId is not null/empty
  }

  // SUBMIT AND PAYLOAD
  onSubmit() {
    if (this.form.invalid) return;

    const payload = this.buildPayload();
    if (this.isEditMode) {
      this.tourService.updateTourBy(payload, this.tourId).subscribe({
        next: () => {
          this.notificationService.notify({
            message: 'Tour successfully updated!',
            type: 'success',
          });
        },
        error: (err: { error: { message: string } }) => {
          const backendMessage =
            err?.error?.message ||
            'Something went wrong during updating the tour, please try again.';
          this.notificationService.notify({
            message: backendMessage,
            type: 'error',
            duration: 8000,
          });
        },
      });
    } else {
      this.tourService.createTour(payload).subscribe({
        next: () => {
          this.notificationService.notify({
            message: 'New tour created',
            type: 'success',
          });
          this.resetForm();
        },
        error: (err: { error: { message: string } }) => {
          const backendMessage =
            err?.error?.message ||
            'Something went wrong during creating the tour, please try again.';
          this.notificationService.notify({
            message: backendMessage,
            type: 'error',
            duration: 8000,
          });
        },
      });
    }
  }

  private resetForm() {
    this.form.reset();
    this.coverPreview = null;
    this.imagePreviews = {};
    this.guidesArray.clear();
  }

  private buildPayload(): FormData {
    const fv = this.form.value;
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
    if (this.coverFile) {
      formData.append('imageCover', this.coverFile);
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
    this.guidesArray.value.forEach((g: any) =>
      formData.append('guides', g._id || g.id),
    );

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
