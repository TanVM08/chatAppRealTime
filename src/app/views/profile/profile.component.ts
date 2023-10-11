import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UploadImageService } from 'src/app/services/upload-image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  hide: boolean = true;
  acceptTypeImage: string[] = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
  ];
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private auth: AuthService,
    private uploadFile: UploadImageService
  ) {}
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.profileForm = this.fb.group({
      userName: [null, [Validators.required]],
      displayName: [null, [Validators.required]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/),
        ],
      ],
      password: [null, [Validators.required]],
      passwordConfirm: [null, Validators.required],
    });
  }
  getValue(value: string) {
    this.profileForm.get(value)?.value;
  }

  changeFile(event: any) {
    if (event) {
      let arrFile = event.target.files[0];
      if (!this.acceptTypeImage.includes(arrFile.type)) {
        this.toast.showWarning('Chỉ được upload file có định dạng ảnh!');
        return;
      }

      event.target.value = '';
    }
  }
  doSave() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.toast.showWarning('Thông báo', 'Kiểm tra thông tin đầu vào');
      return;
    }
    const { userName, displayName, email, password, passwordConfirm } =
      this.profileForm.value;
    if (!password.includes(passwordConfirm)) {
      this.toast.showWarning(
        'Thông báo',
        'Mật khẩu xác nhận không trùng khớp. Vui lòng nhập lại'
      );
      this.profileForm.controls['passwordConfirm'].setValue(null);
      return;
    }
    this.auth.signUp(email, password).subscribe(
      (res) => {
        // console.log('res', res?.user?.uid);
      },
      (error) => {
        this.toast.showError(error.message ? error.message : error);
      }
    );
  }
}
