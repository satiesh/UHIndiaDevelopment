/**
 * @author satiesh darmaraj
 * created on 02/13/2019
 */

import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber, findNumbers, isValidNumber, NumberFound } from 'libphonenumber-js'
import { Phone } from '@app/models/phone'
/*
 
*/


@Pipe({ name: 'FPhone' })
export class FormatPhonePipe implements PipeTransform {
//  transform(value: string, type: string): Phone { return null;}

  transform(value: string, type: string): Phone {
    let oPhone = new Phone(value, type);
    if (!value) {
      oPhone.ErrorMessage = "";
      return oPhone;
    }
    // var phone = oPhone.inputPhone;
    //console.log(value);
    
    var result = findNumbers(oPhone.InputPhone, { defaultCountry: 'US', v2: true });
    //console.log(JSON.stringify(result));
    if (oPhone.Type == 'mobile') {
      if (result && result.length > 0 && result[0]["number"].ext && result[0]["number"].ext.length > 0) {
        oPhone.IsValid = false;
        oPhone.FormattedPhone = oPhone.InputPhone;
        oPhone.ErrorMessage = "Extensions not allowed in mobile";
        //console.log('invalid extension');
      }
      if (result && result.length > 0 && result[0]["number"].country == 'US') {
        oPhone.FormattedPhone = formatNumber({ country: 'US', phone: result[0]["number"].nationalNumber }, 'INTERNATIONAL')
        oPhone.IsValid = true;
        //console.log('Mobile US mobile:' + oPhone.FormattedPhone);
      }
      else if (result && result.length > 0 && result[0]["number"].country) {
        oPhone.FormattedPhone = formatNumber({ country: result[0]["number"].country, phone: result[0]["number"].nationalNumber }, 'INTERNATIONAL')
        oPhone.IsValid = true;
        //console.log('Mobile Int mobile:' + oPhone.FormattedPhone)
      }
      else {
        oPhone.FormattedPhone = oPhone.InputPhone;
        oPhone.IsValid = false;
        oPhone.ErrorMessage = "Invalid mobile";
      }
    }
    else {
      if (result && result.length > 0 && result[0]["number"].country == 'US') {
        oPhone.FormattedPhone = formatNumber({ country: 'US', phone: result[0]["number"].nationalNumber, ext: result[0]["number"].ext || '' }, 'INTERNATIONAL')
        //console.log('Phone US phone:' + oPhone.FormattedPhone);
        oPhone.IsValid = true;
      }
      else if (result && result.length > 0 && result[0]["number"].country) {
        oPhone.FormattedPhone = formatNumber({ country: result[0]["number"].country, phone: result[0]["number"].nationalNumber, ext: result[0]["number"].ext || '' }, 'INTERNATIONAL')
       // console.log('Phone Int Phone:' + oPhone.FormattedPhone)
        oPhone.IsValid = true;
      }
      else {
        oPhone.ErrorMessage = "Invalid Phone";
        oPhone.FormattedPhone = oPhone.InputPhone;
        oPhone.IsValid = false;
      }
    }
    //console.log(JSON.stringify(oPhone));
    return oPhone;
  }
}
