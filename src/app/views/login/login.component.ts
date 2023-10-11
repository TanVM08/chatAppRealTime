import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/),
        ],
      ],
      password: [null, [Validators.required]],
    });
  }

  getValue(value: string) {
    this.loginForm.get(value)?.value;
  }
  doLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.showWarning('Thông báo', 'Kiểm tra thông tin đầu vào');
      return;
    }
    const { email, password } = this.loginForm.value;
    this.spinner.show();
    this.auth.login(email, password).subscribe(
      (res) => {
        console.log('resData', res);
        this.spinner.hide();
        this.toast.showSuccess('Thông báo', 'Đăng nhập thành công');
        this.router.navigate(['/profile']);
      },
      (error) => {
        this.spinner.hide();
        this.toast.showError(error.message ? error.message : error);
      }
    );
  }
}
