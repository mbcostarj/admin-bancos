import { Status } from "./statusBanco.model";

export interface BancoRequest {
  id: number | 0;
  codigo: number;
  descricao: string;
  status: Status;
 }
