import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { RequestOptions } from 'src/app/models/apiRequestOptions.model';
import { BancoResponse } from 'src/app/models/bancosResponse.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ModalComponent } from '../../template/modal/modal.component';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.scss']
})
export class BancosComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('inputSearch') input: ElementRef;

  obterBancosSub!: Subscription;
  bancos: BancoResponse;
  requestOptions:RequestOptions = {
    page: 1,
    pageSize: 10,
    orderBy: 'id',
    orderDir: "ASC",
    pesquisa: ''
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    private apiService:ApiService,
    private fb: FormBuilder,
    public user: UserService,
    private modalService: NgbModal
  ){

  }

  ngOnInit(): void{

    if ( this.user.usuarioPodeListar() ){
      this.obterBancos();
    } else {
      //navegarPara401()
    }

  }
  ngOnDestroy(): void {
    this.obterBancosSub.unsubscribe();
  }
  ngAfterViewInit() {
    fromEvent(this.input.nativeElement,'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(700),
                distinctUntilChanged(),
                tap((event:KeyboardEvent) => {
                  this.requestOptions.pesquisa = this.input.nativeElement.value;
                  this.requestOptions.page = 1;
                  this.obterBancos();
                })
            )
            .subscribe();
  }

  obterBancos(): void{
    this.obterBancosSub = this.apiService.getBancos(this.requestOptions)
    .subscribe(res => {
      this.bancos = res;
    });
  }

  get numbers(): number[] {
    const limit = Math.ceil( (this.bancos.totalElements / this.requestOptions.pageSize ) - 1 );
    return Array.from({ length: limit }, (_, i) => i + 1);
  }

  proximaPagina() {
    this.requestOptions.page++;
    this.obterBancos();
  }

  paginaAnterior() {
    this.requestOptions.page--;
    this.obterBancos();
  }

  paginPorNumero(page: number) {
    this.requestOptions.page = page;
    this.obterBancos();
  }

  navegarParaFormulario(metodo:string, bancoId:number = null){
    if( metodo === "adicionar" ){
      this.router.navigate(['bancos', 'adicionar']);
    } else if ( metodo === "alterar" ){

    }
  }

  excluirBanco(bancoId:number):void{
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.user = bancoId;
    modalRef.componentInstance.status = true;
    modalRef.componentInstance.mensagem = "Tem certeza que deseja excluir esse banco??";

    modalRef.result.then((result) => {
      if (result) {
        if(result === "confirmado"){
          this.apiService.deleteBanco(bancoId)
          .subscribe(() => {
            const modalRef = this.modalService.open(ModalComponent);
            modalRef.componentInstance.status = true;
            modalRef.componentInstance.mensagem = "Banco excluido com sucesso!";
            this.requestOptions.page = 1;
            this.obterBancos();
          }).unsubscribe;
        }
      }
    });
  }

}
