import { Grua } from "./grua";

export class EstatusGruaDto {
    id: number; // Identificador único del estado
    nombreEstatus: string; // Descripción opcional del estado
    grua: Grua;
}
