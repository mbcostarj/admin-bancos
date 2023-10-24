import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  username = '';
  password = '';
  isLoadingResults = false;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {

}

  ngOnInit():void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async sendLoginForm(): Promise<void> {
    this.isLoadingResults = true;
    try {
      const result = await firstValueFrom(this.authService.login(this.loginForm.value));
      this.isLoadingResults = false;
      this.router.navigate(['/home']).then(_ => console.log('Sucesso!'));
    } catch (err: any) {
      console.log(err);
      this.isLoadingResults = false;
    }
  }


}
