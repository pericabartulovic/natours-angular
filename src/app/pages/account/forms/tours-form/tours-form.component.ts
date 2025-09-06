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
import { UserService } from '../../../../services/user.service';
import { valueGreaterThan } from '../../../../shared/validators/values.validator';
import { User } from '../../../../models/user.model';
import { ControlErrorDirective } from '../../../../shared/control-error/control-error.directive';
import {
  FORM_ERROR_MESSAGES,
  defaultErrorMessages,
} from '../../../../shared/control-error/form-errors';

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
  coverPreview: string | ArrayBuffer | null = null;
  imagePreviews: { [key: number]: string | ArrayBuffer | null } = {};
  imageFiles: string[] = [];
  guideSelectControl!: FormControl;

  guides = [
    {
      id: 'g1',
      name: 'Alice',
      email: 'alice@example.com',
      photo: 'user-8.jpg',
      role: 'lead guide',
    },
    {
      id: 'g2',
      name: 'Bob',
      email: 'bob@example.com',
      photo: 'user-10.jpg',
      role: 'guide',
    },
    {
      id: 'g3',
      name: 'Charlie',
      email: 'charlie@example.com',
      photo: 'user-5.jpg',
      role: 'guide',
    },
  ];

  constructor(
    public authService: AuthService,
    public userService: UserService,
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
      groupSize: ['', { validators: [Validators.required] }],
      difficulty: ['', { validators: [Validators.required] }],
      prices: this.fb.group(
        {
          price: ['', { validators: [Validators.required] }],
          priceDiscount: [''],
        },
        { validators: valueGreaterThan('price', 'priceDiscount') },
      ),
      summary: ['', { validators: [Validators.required] }],
      description: [''],
      coverImage: [null, Validators.required],
      images: this.fb.array(['', '', '']),
      startLocation: this.fb.group({
        startCoordinates: this.fb.group({
          startLong: ['', Validators.required],
          startLat: ['', Validators.required],
        }),
        startAddress: ['', Validators.required],
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
        this.form.get('coverImage')?.setValue(file.name); // to update hidden control
      } else {
        this.imagePreviews[type] = reader.result;
        this.imageFiles.push(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  removeImage(type: 'cover' | number): void {
    if (type === 'cover') {
      this.coverPreview = null;
      this.form.get('coverImage')?.reset();
    } else {
      this.imagePreviews[type] = null;
      this.imageFiles.splice(type - 1, 1);
    }
  }

  // Getter and Factory for creating a dates group
  get startDates(): FormArray {
    return this.form.get('startDates') as FormArray;
  }

  private createStartDatesGroup(): FormGroup {
    return this.fb.group({
      date: ['', Validators.required],
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
        long: [''],
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
    const payload = this.buildPayload();
    console.log('Final payload:', payload);
  }

  private buildPayload() {
    const fv = this.form.value;

    return {
      // Basic fields
      name: fv.name,
      duration: fv.duration,
      difficulty: fv.difficulty,
      groupSize: fv.groupSize,
      secret: fv.secret,
      summary: fv.summary,
      description: fv.description,

      // Price
      price: fv.prices.price,
      priceDiscount: fv.prices.priceDiscount,

      // Images
      coverImage: fv.coverImage,
      images: this.imageFiles,

      // Dates
      startDates: this.formatDates(fv.startDates),

      // Guides
      guides: this.guidesArray.value,

      // Locations
      locations: this.form.value.locations
        .map((loc: any) => {
          const coords = this.formatCoordinates(loc.coordinates);
          if (!coords) return null;
          return {
            ...loc,
            coordinates: coords,
          };
        })
        .filter(Boolean),

      // Start location
      startLocation: {
        coordinates: this.formatCoordinates(
          this.form.value.startLocation.startCoordinates,
        ),
        address: this.form.value.startLocation.startAddress || undefined,
        description:
          this.form.value.startLocation.startDescription || undefined,
      },
    };
  }

  private formatCoordinates(
    coord: { long: string; lat: string } | null,
  ): number[] | undefined {
    if (!coord || !coord.long || !coord.lat) return [];
    return [parseFloat(coord.long), parseFloat(coord.lat)];
  }

  private formatDates(dates: any[] = []): string[] | undefined {
    if (!dates.length) return [];
    return dates
      .map((d) => d.date)
      .filter(Boolean)
      .map((d) => new Date(d).toISOString());
  }
}
