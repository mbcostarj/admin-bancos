import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/view/login/login.component';
import { HomeComponent } from './components/view/home/home.component';
import { AuthGuard } from './auth.guard';
import { BancosComponent } from './components/view/bancos/bancos.component';
import { BancosFormComponent } from './components/view/bancos/bancos-form/bancos-form.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'bancos', canActivate: [AuthGuard], component: BancosComponent },
  { path: 'bancos/:id', canActivate: [AuthGuard], component: BancosFormComponent },
  { path: 'bancos/adicionar', canActivate: [AuthGuard], component: BancosFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
