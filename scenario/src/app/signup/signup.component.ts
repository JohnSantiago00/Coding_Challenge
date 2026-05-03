import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AsyncPipe, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  protected email: string = '';
  protected password: string = '';
  protected confirmPassword: string = '';
  protected authError$: Observable<string | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.clearError()
    this.authError$ = this.authService.authError$
  }

  protected passwordsDoNotMatch(): boolean {
    return (
      this.confirmPassword.length > 0 && this.password !== this.confirmPassword
    )
  }

  protected onSubmit(signupForm: NgForm): void {
    if (signupForm.invalid || this.passwordsDoNotMatch()) {
      return
    }

    this.authService.signup(this.email, this.password).subscribe({
      next: () => {
        this.email = ''
        this.password = ''
        this.confirmPassword = ''
        this.router.navigate(['/tasks'])
      },
    })
  }
}
