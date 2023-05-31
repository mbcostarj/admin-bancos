import { Status } from "./statusBanco.model";

export interface Banco {
  id: number;
  status: Status;
  descricao: string;
  codigo: number;
 }
