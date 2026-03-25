import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../shared/services/auth-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  standalone: false,
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {
  loading = true;
  success = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if(!token){
      this.loading = false;
      this.success = true;
      this.message = 'Invalid verification like. No token provided.'
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (Response: any) => {
      this.loading = false;
      this.success = false;
      this.message = Response.message || 'Email verified successfully! You can now login.'
      },
      error: (err) => {
        this.loading = false;
      this.success = false;
      this.message = err.error?.error || 'Verification failed. The link may have expired or is invalid.'
      }
    })
  }
}
