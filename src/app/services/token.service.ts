import { Injectable } from '@angular/core';
const ACCESS_TOKEN  = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USER  = "user";
const ROLES = "roles";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN)!;
  }

  getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN)!;
  }

  getRoles(): []{
    return JSON.parse(localStorage.getItem(ROLES)!);
  }

  saveToken(token: any): void {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  saveUserInfo(userinfo:any): void {
    localStorage.setItem(ROLES, JSON.stringify(userinfo.authorities));
    localStorage.setItem(USER, userinfo.name);
  }

  removeUserinfo(): void{
    localStorage.removeItem(ROLES);
    localStorage.removeItem(USER);
  }

  getUserName(): string {
    return localStorage.getItem(USER)!;
  }

  saveRefreshToken(refreshToken: any): void {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  removeToken(): void {
    localStorage.removeItem(ACCESS_TOKEN);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN);
  }

}
