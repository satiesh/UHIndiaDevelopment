// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { AbstractControl, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { ErrorStateMatcher } from '@angular/material/core';
import { FormatPhonePipe } from '@app/pipes/format.phone';


export class ValidationService {
    static getValidatorErrorMessage(
        validatorName: string,
        validatorValue?: any
    ) {
        let config = {
            required: "This field is Required",
            onlynumbersallowed: "Only numbers are allowed",
            invalidDropdown: "Select a value from the drop down",
            invalidCreditCard: 'Is invalid credit card number',
            invalidEmailAddress: "Invalid email address",
            invalidEmailDomain: "Invalid email domain",
            emailAlreadyInUse: "Username/Email already exists in the system. Please provide a new email address.If you think this is a mistake, please contact Support.",
            invalidNumber: "Incorrect format",
            whitespace: "Please enter some characters",
            invalidPhone: `Please enter valid phone with country code + phonenumber + extension(optional)`,
            invalidMobile: `Please enter valid mobile number with country code + mobilenumber`,
            invalidMobileExt: `Mobile should not contain extensions`,
            invalidSixDigitVerification: ' Please select Email or Mobile to send the verification code',
            minlength: `Minimum length is ${validatorValue.requiredLength}`,
            maxlength: `Maximum length is ${validatorValue.requiredLength}`,
            dateerror: "Start Date cannot be >= End Date",
            verificationCodExpired: "We are unable to validate the code you have entered. Either the code is expired or the entered code does not match our records.Please click on the try other option to get a new one.If you still face a problem please contact customer support.",
            invalidPassword: "Please follow password rule"
        };

        return config[validatorName];
    }

    static emailValidator(
        control: AbstractControl
    ): { [key: string]: boolean } | null {
        if (control.value != null) {
            if (
                control.value.match(
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            ) {
                return null;
            } else {
                return { invalidEmailAddress: true };
            }
        }
    }
    static mobileValidator(control) {
        if (control.value != null && control.value != "") {
          var oPhone = new FormatPhonePipe().transform(
            control.value,
            "mobile"
          );
          if (oPhone.IsValid) {
            return null;
          } else {
            console.log(oPhone.ErrorMessage);
            if (oPhone.ErrorMessage == "Extensions not allowed in mobile") {
              return { invalidMobileExt: true };
            } else {
              return { invalidMobile: true };
            }
          }
        } else {
          return null;
        }
      }

      static phoneValidator(control) {
        if (control.value != null) {
          var oPhone = new FormatPhonePipe().transform(
            control.value,
            "phone"
          );
          if (oPhone.IsValid) {
            return null;
          } else return { invalidPhone: true };
        } else {
          return null;
        }
      }

}


export class ConfirmValidParentMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control.parent.invalid && control.touched;
    }
}
