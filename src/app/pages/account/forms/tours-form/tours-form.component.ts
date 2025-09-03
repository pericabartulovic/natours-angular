import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { ConfirmDialogComponent } from '../../../../components/shared/confirm-dialog/confirm-dialog.component';
import { User } from '../../../../models/user.model';
import { valueGreaterThan } from '../../../../shared/validators/values.validator';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-tours-form',
  imports: [ReactiveFormsModule, AsyncPipe, NgFor, NgIf],
  templateUrl: './tours-form.component.html',
  styleUrl: './tours-form.component.scss',
})
export class ToursFormComponent implements OnInit {
  user$!: Observable<User | null>;
  form!: FormGroup;
  startLocation!: FormGroup;
  coverPreview: string | ArrayBuffer | null = null;
  imagePreviews: { [key: number]: string | ArrayBuffer | null } = {};
  selectedGuides: string[] = [];

  guides = [
    { id: 'g1', name: 'Alice' },
    { id: 'g2', name: 'Bob' },
    { id: 'g3', name: 'Charlie' },
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
      price: [
        '',
        {
          validators: [
            Validators.required,
            valueGreaterThan('price', 'discount'),
          ],
        },
      ],
      discount: ['', { validators: [Validators.required] }],
      summary: ['', { validators: [Validators.required] }],
      description: [''],
      startLocation: this.fb.group({
        startLong: ['', Validators.required],
        startLat: ['', Validators.required],
        startAddress: ['', Validators.required],
        startDescription: [''],
      }),
      startDates: this.fb.array([this.createStartDatesGroup()]),
      locations: this.fb.array([this.createLocationGroup()]),
      secret: [false, { validators: [Validators.required] }],
      guide: [''],
    });
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
      long: ['', Validators.required],
      lat: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
    });
  }

  addLocation(): void {
    this.locations.push(this.createLocationGroup());
  }

  removeLocation(index: number): void {
    this.locations.removeAt(index);
  }

  // Guides:
  getGuideName(guideId: string): string | undefined {
    return this.guides.find((g) => g.id === guideId)?.name;
  }

  addGuide() {
    const guide = this.form.controls['guide'].value;
    if (guide && !this.selectedGuides.includes(guide)) {
      this.selectedGuides.push(guide);
    }
    this.form.controls['guide'].reset();
  }

  // Remove guide
  removeGuide(guideId: string) {
    this.selectedGuides = this.selectedGuides.filter((g) => g !== guideId);
  }

  onSubmit() {
    // const { name, email, photo } = this.form.value;
    // const formData = new FormData();
    // formData.append('name', name!.trim());
    // formData.append('email', email!.trim());
    // if (photo) formData.append('photo', photo);
    // this.userService.updateMe(formData);
  }
}
