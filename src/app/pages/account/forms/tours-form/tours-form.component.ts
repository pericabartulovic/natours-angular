import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
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
import { valueGreaterThan } from '../../../../shared/validators/values.validator';
import { ControlErrorDirective } from '../../../../shared/control-error/control-error.directive';
import {
  FORM_ERROR_MESSAGES,
  defaultErrorMessages,
} from '../../../../shared/control-error/form-errors';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-tours-form',
  imports: [ReactiveFormsModule, AsyncPipe, ControlErrorDirective],
  providers: [{ provide: FORM_ERROR_MESSAGES, useValue: defaultErrorMessages }],
  templateUrl: './tours-form.component.html',
  styleUrls: ['./tours-form.component.scss'],
})
export class ToursFormComponent implements OnInit {
  user$!: Observable<User | null>;
  form!: FormGroup;
  startLocation!: FormGroup;
  coverFile?: File;
  imageFiles: File[] = [];
  coverPreview: string | ArrayBuffer | null = null;
  imagePreviews: { [key: number]: string | ArrayBuffer | null } = {};
  guideSelectControl!: FormControl;

  guides = [
    {
      id: '5c8a21f22f8fb814b56fa18a',
      name: 'Alice',
      email: 'alice@example.com',
      photo: 'user-8.jpg',
      role: 'lead guide',
    },
    {
      id: '5c8a201e2f8fb814b56fa186',
      name: 'Bob',
      email: 'bob@example.com',
      photo: 'user-10.jpg',
      role: 'guide',
    },
    {
      id: '5c8a23412f8fb814b56fa18c',
      name: 'Charlie',
      email: 'charlie@example.com',
      photo: 'user-5.jpg',
      role: 'guide',
    },
  ];

  constructor(
    public authService: AuthService,
    public tourService: TourService,
    public userService: UserService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    // this.user$.subscribe((user) => {
    //   if (user) {
    //     this.form.patchValue({
    //       name: user.name,
    //       email: user.email,
    //     });
    //   }
    // });

    // this.form.patchValue({
    //   name: tour.name,
    //   startLocation: {
    //     long: tour.startLocation.coordinates[0],
    //     lat: tour.startLocation.coordinates[1],
    //     address: tour.startLocation.address,
    //     description: tour.startLocation.description,
    //   },
    // });

    // // Patch locations array
    // this.locations.clear();
    // tour.locations.forEach((loc) => {
    //   this.locations.push(
    //     this.fb.group({
    //       long: loc.coordinates[0],
    //       lat: loc.coordinates[1],
    //       address: loc.address,
    //       description: loc.description,
    //     }),
    //   );
    // });

    this.form = this.fb.group({
      name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(40),
          ],
          updateOn: 'change',
        },
      ],
      duration: ['', { validators: [Validators.required] }],
      maxGroupSize: ['', { validators: [Validators.required] }],
      difficulty: ['', { validators: [Validators.required] }],
      prices: this.fb.group(
        {
          price: ['', { validators: [Validators.required] }],
          priceDiscount: ['0'],
        },
        { validators: valueGreaterThan('price', 'priceDiscount') },
      ),
      summary: ['', { validators: [Validators.required] }],
      description: [''],
      imageCover: [null, Validators.required],
      images: this.fb.array([], Validators.minLength(1)),
      startLocation: this.fb.group({
        startCoordinates: this.fb.group({
          lng: [''],
          lat: [''],
        }),
        startAddress: [''],
        startDescription: [''],
      }),
      startDates: this.fb.array([this.createStartDatesGroup()]),
      locations: this.fb.array([this.createLocationGroup()]),
      secret: [false],
      guides: this.fb.array([]),
    });
    this.guideSelectControl = this.fb.control<any>(null);
  }

  onFileSelected(event: Event, type: 'cover' | number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (type === 'cover') {
        this.coverPreview = reader.result;
        this.coverFile = file;
        this.form.get('imageCover')?.setValue(file.name); // just for display / hidden control
      } else {
        this.imagePreviews[type] = reader.result;
        this.imageFiles[type] = file;
        // this.form.get('image')?.setValue(file.name); // optional, for hidden control
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
      this.imagePreviews[type] = null;
      this.imageFiles.splice(type, 1);
      // this.form.get('image')?.reset(); // optional, if a hidden control
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
      address: [''],
      description: [''],
    });
  }

  addLocation(): void {
    this.locations.push(this.createLocationGroup());
  }

  removeLocation(index: number): void {
    this.locations.removeAt(index);
  }

  //  Getter and Factory for Guides:
  get guidesArray(): FormArray {
    return this.form.get('guides') as FormArray;
  }

  private createGuideGroup(guide: any): FormGroup {
    return this.fb.group({
      id: [guide.id, Validators.required],
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
      (g: any) => g.id === guide.id,
    );
    if (!alreadyExists) {
      this.guidesArray.push(this.createGuideGroup(guide));
    }

    this.guideSelectControl.reset();
  }

  removeGuide(index: number) {
    this.guidesArray.removeAt(index);
  }

  // SUBMIT AND PAYLOAD
  onSubmit() {
    // if (this.form.invalid) return;

    const payload = this.buildPayload();

    this.tourService.saveNewTour(payload).subscribe({
      next: () => {
        this.notificationService.notify({
          message: 'New tour created',
          type: 'success',
        });

        this.form.reset();
        this.coverPreview = null;
        this.imagePreviews = {};
        this.imageFiles = [];
        this.guidesArray.clear();
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

    // Images
    if (this.coverFile) formData.append('imageCover', this.coverFile);
    this.imageFiles.forEach((file) => formData.append('images', file));

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
      formData.append(`locations[${i}][address]`, loc.address || '');
      formData.append(`locations[${i}][description]`, loc.description || '');
      formData.append(`locations[${i}][day]`, (i + 1).toString());
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
