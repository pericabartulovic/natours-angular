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
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { ControlErrorDirective } from '../../../../shared/control-error/control-error.directive';
import {
  FORM_ERROR_MESSAGES,
  defaultErrorMessages,
} from '../../../../shared/control-error/form-errors';
import { TourFormBuilder } from './helpers/tour-from-builder';
import { TourFormPopulate } from './helpers/tour-form-populate';
import { TourFormBuildPayload } from './helpers/tour-form-build-payload';

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
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private destroyRef: DestroyRef,
    private formHelper: TourFormBuilder,
    private formPopulate: TourFormPopulate,
    private buildPayloadHelper: TourFormBuildPayload,
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

            const { imagePreviews, coverPreview } =
              this.formPopulate.populateImages(
                this.form,
                tour,
                this.imagePreviews,
              );
            this.imagePreviews = imagePreviews;
            this.coverPreview = coverPreview;

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

  // -------------------- IMAGES --------------------
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

  // -------------------- DATES --------------------
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

  // -------------------- LOCATIONS --------------------
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

  // -------------------- GUIDES --------------------
  // Getter and Factory for Guides:
  get guidesArray(): FormArray {
    return this.form.get('guides') as FormArray;
  }

  private createGuideGroup(guide: any): FormGroup {
    return this.fb.group({
      _id: [guide._id, Validators.required],
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
      (g: any) => g._id === guide._id,
    );
    if (!alreadyExists) {
      this.guidesArray.push(this.createGuideGroup(guide));
    }

    this.guideSelectControl.reset();
  }

  removeGuide(index: number) {
    this.guidesArray.removeAt(index);
  }
  // ----------------------------------------------------------

  get isEditMode(): boolean {
    return !!this.tourId; // true if tourId is not null/empty
  }

  // SUBMIT AND PAYLOAD
  onSubmit() {
    if (this.form.invalid) return;

    const payload = this.buildPayloadHelper.buildPayload(
      this.form,
      this.coverFile,
      this.guidesArray,
    );
    if (this.isEditMode) {
      this.tourService.updateTourById(payload, this.tourId);
    } else {
      this.tourService.createTour(payload).subscribe({
        next: () => {
          this.resetForm();
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
}
