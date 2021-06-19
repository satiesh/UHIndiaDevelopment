import { sendinblueattributes } from './sendinblueattributes';

// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class sendinbluecontact {
  constructor(email?: string, attributes?: sendinblueattributes, listIds?: Array<number>) {
    this.email = email;
    this.attributes = attributes;
    this.listIds = listIds
  }
  email: string;
  attributes: sendinblueattributes;
  listIds: Array<number>;
}
