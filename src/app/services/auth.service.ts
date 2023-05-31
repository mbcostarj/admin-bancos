import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './api.service';

const OAUTH_CLIENT = 'sinple-web';
const OAUTH_SECRET = 'ZzVCevKWN9kQ1SNjahS6HhQ6yB4bqdc6';
const API_AUTH_URL = 'http://auth-keycloak-dev.us-east-1.elasticbeanstalk.com/realms/princeton-lemitar/protocol/openid-connect/token';
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl = "";
  jwtService: JwtHelperService = new JwtHelperService();

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Erro:', error.error.message);
    } else {
      console.error(
        `CODE: ${error.status}, ` +
        `BODY: ${error.error}`);
    }
    return throwError(() => new Error('Erro inesperado. Tente mais tarde.'));
  }

  private static log(message: string): any {
    console.log(message);
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private apiService:ApiService
    ) {

    }

  login(loginData: any): Observable<any> {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    const body = new HttpParams()
      .set('username', loginData.username)
      .set('password', loginData.password)
      .set('grant_type', 'password')
      .set('client_id', OAUTH_CLIENT)
      .set('client_secret', OAUTH_SECRET);

    return this.http.post<any>(API_AUTH_URL, body, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          var userInfo = this.jwtService.decodeToken(res.access_token);
          this.tokenService.saveToken(res.access_token);
          this.tokenService.saveUserInfo(userInfo);
          this.tokenService.saveRefreshToken(res.refresh_token);
        }),
        catchError(AuthService.handleError)
      );
  }

  refreshToken(refreshData: any): Observable<any> {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    const body = new HttpParams()
      .set('refresh_token', refreshData.refresh_token)
      .set('grant_type', 'refresh_token');
    return this.http.post<any>(API_AUTH_URL, body, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this.tokenService.saveToken(res.access_token);
          this.tokenService.saveRefreshToken(res.refresh_token);
        }),
        catchError(AuthService.handleError)
      );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    this.tokenService.removeUserinfo();
  }

  secured(): Observable<any> {
    return this.http.get<any>(API_AUTH_URL + 'secret')
      .pipe(catchError(AuthService.handleError));
  }

  roleMatch(allowedRoles:any): any {

    let isMatch = false;
    const userRoles: any = this.tokenService.getRoles();

    if (userRoles != null && userRoles) {
      if(userRoles.includes(allowedRoles)){
        isMatch = true;
        return isMatch;
      }else{
        return isMatch;
      }

    }
  }

}
