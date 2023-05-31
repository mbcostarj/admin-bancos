import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/components/template/modal/modal.component';
import { Banco } from 'src/app/models/bancoResponse.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bancos-form',
  templateUrl: './bancos-form.component.html',
  styleUrls: ['./bancos-form.component.scss']
})

export class BancosFormComponent implements OnInit{

  bancoId: number = 0;
  formBancos:FormGroup;
  banco:Banco;
  metodo:string = "cadastrar";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private api: ApiService,
    public user: UserService,
    private modal: NgbModal ){

  }

  ngOnInit():void{
    this.criarFormulario();

    if ( this.activatedRoute.snapshot.url[1].path != "adicionar" ){ //verifica se path é de alteração
      if( !this.user.usuarioPodeAlterar() ){
        this.formBancos.disable();
      }
      this.metodo = "alterar";
      this.bancoId = parseInt( this.activatedRoute.snapshot.url[1].path );
      this.api.getBancoById(this.bancoId)
        .subscribe((response:Banco) => {
          this.banco = response;
          this.formBancos.controls['codigo'].setValue(response.codigo);
          this.formBancos.controls['descricao'].setValue(response.descricao);
          this.formBancos.controls['status'].setValue((response.status.id == "A" ? true : false));
        }).unsubscribe;
    }

  }

  criarFormulario(){
    this.formBancos = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      status: ['', Validators.required]
    })
  }

  salvarBanco(){

    const formData = {
      id: this.bancoId,
      codigo: this.formBancos.controls['codigo'].value,
      descricao: this.formBancos.controls['descricao'].value,
      status: {
        descricao: (this.formBancos.controls['status'].value == 'true' ? 'ATIVO' : 'INATIVO'),
        id: (this.formBancos.controls['status'].value == 'true' ? 'A' : 'I')
      }
    }

    if( this.metodo === "cadastrar" ){//verifica o metdo

      if( this.formBancos.touched && this.formBancos.dirty ){
        this.api.postBancos(formData)
          .subscribe((response) => {
            this.banco = response;
            if(response.id != ""){
              const modalRef = this.modal.open(ModalComponent);
              modalRef.componentInstance.status = true;
              modalRef.componentInstance.mensagem = "Banco cadastrado com sucesso!";
              modalRef.result.then((result) => {
                if (result) {
                  this.cancelar();
                }
              });

            }
          });
      }

    } else {

      this.api.putBancos(formData)
        .subscribe((response) => {
          this.banco = response;
            if(response.id != ""){
              const modalRef = this.modal.open(ModalComponent);
              modalRef.componentInstance.status = true;
              modalRef.componentInstance.mensagem = "Banco alterado com sucesso!";
              modalRef.result.then((result) => {
                if (result) {
                  this.cancelar();
                }
              });
            }
        });

    }

  }

  cancelar(): void{
    this.router.navigate(['bancos']);
  }
}
