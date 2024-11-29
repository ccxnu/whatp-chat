import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

interface FacturationProps
{
  legalName: string; // Nombre o razón social exacta
  rucOrCedula: string; // RUC o cédula (13 dígitos)
  phoneNumber: string; // Teléfono con prefijo de provincia Ejm. (02) 3240031
  accountingEmail: string; // Correo del área de contabilidad
  province: string; // Provincia
  canton: string; // Cantón
  mainStreet: string; // Calle principal
  addressNumber: string; // Numeración
  secondaryStreet: string; // Calle secundaria

  isMemberOfEquinoccioNetwork: boolean;

  dateCreated: Date;
  dateUpdated: Date;
}

export class Facturation extends Entity<FacturationProps>
{
  get legalName()
  {
    return this.props.legalName;
  }

  set legalName(legalName: string)
  {
    this.props.legalName = legalName;
  }

  get rucOrCedula()
  {
    return this.props.rucOrCedula;
  }

  set rucOrCedula(ruc: string)
  {
    this.props.rucOrCedula = ruc;
  }

  get phoneNumber()
  {
    return this.props.phoneNumber;
  }

  set phoneNumber(phoneNumber: string)
  {
    this.props.phoneNumber = phoneNumber;
  }

  get accountingEmail()
  {
    return this.props.accountingEmail;
  }

  set accountingEmail(accountingEmail: string)
  {
    this.props.accountingEmail = accountingEmail;
  }

  get province()
  {
    return this.props.province;
  }

  set province(province: string)
  {
    this.props.province = province;
  }

  get canton()
  {
    return this.props.canton;
  }

  set canton(canton: string)
  {
    this.props.canton = canton;
  }

  get mainStreet()
  {
    return this.props.mainStreet;
  }

  set mainStreet(mainStreet: string)
  {
    this.props.mainStreet = mainStreet;
  }

  get addressNumber()
  {
    return this.props.addressNumber;
  }

  set addressNumber(addressNumber: string)
  {
    this.props.addressNumber = addressNumber;
  }

  get secondaryStreet()
  {
    return this.props.secondaryStreet;
  }

  set secondaryStreet(secondaryStreet: string)
  {
    this.props.secondaryStreet = secondaryStreet;
  }

  get isMemberOfEquinoccioNetwork()
  {
    return this.props.isMemberOfEquinoccioNetwork;
  }

  set isMemberOfEquinoccioNetwork(isMember: boolean)
  {
    this.props.isMemberOfEquinoccioNetwork = isMember;
  }

  get dateCreated()
  {
    return this.props.dateCreated;
  }

  get dateUpdated()
  {
    return this.props.dateUpdated;
  }

  updateFacturation()
  {
    this.props.dateUpdated = new Date();
  }

  static create(
    props: Optional<FacturationProps, 'dateCreated' | 'dateUpdated'>,
    id?: UniqueEntityId
  )
  {
    const entity = new Facturation(
      {
        ...props,
        dateCreated: props.dateCreated ?? new Date(),
        dateUpdated: props.dateUpdated ?? props.dateCreated ?? new Date(),
      },
      id
    );

    return entity;
  }
}
