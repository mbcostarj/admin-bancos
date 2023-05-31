import { Banco } from "./bancoResponse.model";
import { Pageable } from "./pageable.model";

export interface BancoResponse {
  content: Banco[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  size: number;
  empty: boolean;
 }
