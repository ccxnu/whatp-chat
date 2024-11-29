export interface FacturationTable
{
  id: string; // UUID de la facturación
  legal_name: string; // Nombre o razón social
  ruc_or_cedula: string; // RUC o cédula
  phone_number: string; // Teléfono
  accounting_email: string; // Correo electrónico
  province: string; // Provincia
  canton: string; // Cantón
  main_street: string; // Calle principal
  addrees_number: string; // Numeración
  secondary_street: string; // Calle secundaria
  is_member_of_equinoccio_network: boolean;
  date_created: Date;
  date_updated: Date;
}
