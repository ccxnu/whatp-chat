export interface EmailVerificationRequest
{
  idUser: string;
  idInstitution: number;
  idSolution: number;
  idRequest: string;
  processDate: string;
  process: string;
  tipo: string;
  prioridad: string;
  destinos: string[];
  plantilla: string;
  lista_vals_email: string[];
  lista_vars_email: string[];
  asunto: string;
  nom_envia: string;
  correo_envia: string;
  intentos: number;
}
