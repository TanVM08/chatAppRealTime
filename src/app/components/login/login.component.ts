import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}
  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/),
      ],
    ],
    password: ['', Validators.required],
  });

  getValueForm(value: string) {
    this.loginForm.get(value)?.value;
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.showWarning('Thông báo', 'Kiểm tra thông tin đầu vào');
      return;
    }
    let email = this.loginForm.controls['email'].value;
    let password = this.loginForm.controls['password'].value;
    this.loading = true;
    this.authService.login(email, password).subscribe(
      (res) => {
        this.loading = false;
        this.toast.showSuccess('Thông báo', 'Đăng nhập thành công');
        this.router.navigate(['/home']);
      },
      (erorr) => {
        this.loading = false;
        this.toast.showError(erorr.message ? erorr.message : erorr);
      }
    );
  }
}
