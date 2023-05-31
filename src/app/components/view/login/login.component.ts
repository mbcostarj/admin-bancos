import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  onFormSubmit(): void {
    this.isLoadingResults = true;
    this.authService.login(this.loginForm.value)
      .subscribe(() => {
        this.isLoadingResults = false;
        this.router.navigate(['/home']).then(_ => console.log('Sucesso!'));
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }).unsubscribe;
  }

}
