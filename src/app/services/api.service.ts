import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { RequestOptions } from '../models/apiRequestOptions.model';
import { BancoRequest } from '../models/bancoRequest.model';
import { BancosFormComponent } from '../components/view/bancos/bancos-form/bancos-form.component';

const URL_API = "http://sinple-api-dev.us-east-1.elasticbeanstalk.com:8080/v1/bancos";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private token:TokenService,
    private http:HttpClient
    ) {

  }

  obterAuthHeader() {

    if (this.token.getToken()) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token.getToken()}`
        });
        return headers;
    }
    return new HttpHeaders({
        'Content-Type': 'application/json'
    });

  }

  getBancos(options:RequestOptions): Observable<any>{
    const url = `${URL_API}?pageNumber=${options.page}&pageSize=${options.pageSize}&pesquisa=${options.pesquisa}&sort=${options.orderBy}&direction=${options.orderDir}`;
    return this.http.get(url, { headers:this.obterAuthHeader() })
      .pipe(catchError(this.handleError));
  }

  getBancoById(bancoId:number): Observable<any>{
    return this.http.get(`${URL_API}/${bancoId}`, { headers:this.obterAuthHeader() })
    .pipe(catchError(this.handleError));
  }

  postBancos(formData:BancoRequest): Observable<any>{
    return this.http.post(URL_API, formData, { headers:this.obterAuthHeader() })
    .pipe(catchError(this.handleError));
  }
  putBancos(formData:BancoRequest): Observable<any>{
    return this.http.put(`${URL_API}/${formData.id}`, formData, { headers:this.obterAuthHeader() })
    .pipe(catchError(this.handleError));
  }
  deleteBanco(bancoId:number): Observable<any>{
    return this.http.delete(`${URL_API}/${bancoId}`, { headers:this.obterAuthHeader() })
    .pipe(catchError(this.handleError));
  }

  handleError(handleError: any): any {
    throw new Error('Method not implemented.');
  }
}
