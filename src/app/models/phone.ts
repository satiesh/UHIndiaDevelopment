/**
 * @author satiesh darmaraj
 * created on 01/29/2019
 */

export class Phone {
  constructor(inputValue: string, type: string) {
    this.InputPhone = inputValue,
      this.Type = type
  }
  readonly InputPhone: string;
  readonly Type: string;
  IsValid: boolean;
  FormattedPhone: string;
  ErrorMessage: string;
}
