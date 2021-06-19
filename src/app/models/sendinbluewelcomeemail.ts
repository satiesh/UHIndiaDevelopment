// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { sendinbluetoaddress } from './sendinbluetoaddress';
import { paramsvalues } from './paramsvalues';
import { sendinblueattachment } from './sendinblueattachment';


export class sendinblueWelcomeMail{
  constructor(sender?: sendinbluetoaddress, to?: sendinbluetoaddress[], templateId?: number, attachment?: sendinblueattachment[], params?: paramsvalues) {
    this.sender= sender;
    this.to = to;
    this.templateId = templateId;
    this.attachment = attachment;
    this.params= params;
  }
  sender: sendinbluetoaddress;
  to: sendinbluetoaddress[];
  templateId: number;
  attachment: sendinblueattachment[];
  params: paramsvalues;
}


