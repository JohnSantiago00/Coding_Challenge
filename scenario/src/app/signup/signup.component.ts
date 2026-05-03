import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  protected handleSubmit(event: SubmitEvent): void {
    event.preventDefault()
  }
}
