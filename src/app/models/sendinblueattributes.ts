import { state } from '@angular/animations';

// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class sendinblueattributes {
  constructor(LASTNAME?: string, FIRSTNAME?: string, SMS?: string, CITY?: string, STATE?: string, COUNTRY?: string, ADDRESS_STREET?: string, POSTAL?: string, DELIVERYADDRESS?: string) {
    this.LASTNAME = LASTNAME;
    this.FIRSTNAME = FIRSTNAME;
    this.SMS = SMS;
    this.CITY = CITY
    this.STATE = STATE
    this.COUNTRY = COUNTRY
    this.ADDRESS_STREET = ADDRESS_STREET
    this.POSTAL = POSTAL
    this.DELIVERYADDRESS = DELIVERYADDRESS;
  }
  LASTNAME: string;
  FIRSTNAME: string;
  SMS: string;
  CITY: string;
  STATE: string;
  COUNTRY: string;
  ADDRESS_STREET: string;
  POSTAL: string;
  DELIVERYADDRESS: string;
}
