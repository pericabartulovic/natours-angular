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
import { ConfirmDialogComponent } from '../../../../components/shared/confirm-dialog/confirm-dialog.component';
import { User } from '../../../../models/user.model';
import { ControlErrorDirective } from '../../../../shared/control-error/control-error.directive';
import { ControlErrorComponent } from '../../../../shared/control-error/control-error/control-error.component';
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
    private dialog: MatDialog,
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
          discount: [''],
        },
        { validators: valueGreaterThan('price', 'discount') },
      ),
      summary: ['', { validators: [Validators.required] }],
      description: [''],
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
      } else {
        this.imagePreviews[type] = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  removeImage(type: 'cover' | number): void {
    type === 'cover'
      ? (this.coverPreview = null)
      : (this.imagePreviews[type] = null);
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

  onSubmit() {
    // const { name, email, photo } = this.form.value;
    // const formData = new FormData();
    // formData.append('name', name!.trim());
    // formData.append('email', email!.trim());
    // if (photo) formData.append('photo', photo);
    // this.userService.updateMe(formData);
    const payload = {
      ...this.form.value,
      guides: this.guidesArray.value,
    };
    console.log('Final payload:', payload);
  }
}
