import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth:AuthService) { }


  public usuarioPodeListar():boolean {
    return ( this.auth.roleMatch("ROLE_BANCO_LST") );
  }
  public usuarioPodeAlterar():boolean {
    return ( this.auth.roleMatch("ROLE_BANCO_EDT") );
  }
  public usuarioPodeExcluir():boolean {
    return ( this.auth.roleMatch("ROLE_BANCO_DEL") );
  }
  public usuarioPodeAdicionar():boolean {
    return ( this.auth.roleMatch("ROLE_BANCO_ADD") );
  }
}
