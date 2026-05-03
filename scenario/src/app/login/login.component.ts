import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AsyncPipe, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected email: string = '';
  protected password: string = '';
  protected showPassword: boolean = false;
  protected authError$: Observable<string | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.clearError()
    this.authError$ = this.authService.authError$
  }

  protected onSubmit(loginForm: NgForm): void {
    if (loginForm.invalid) {
      return
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.email = ''
        this.password = ''
        this.router.navigate(['/tasks'])
      },
    })
  }

  protected togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }
}
