export class userothervalues {

  constructor(investorLevel?: string, investmentType?: string, tradingTools?: string,
    investingobjective?: string, bestCommunicationMethod?: string,
    bestTimeToCall?: string, professionalField?: string,
    discordID?: string, currentPortfolioSize?: string,
    volunteer?: string, ipaddress?: string,
    createdOn?: Date, createdBy?: string) {
    this.investorLevel = investorLevel;
    this.investmentType = investmentType;
    this.tradingTools = tradingTools;
    this.investingobjective = investingobjective;
    this.bestCommunicationMethod = bestCommunicationMethod;
    this.bestTimeToCall = bestTimeToCall;
    this.professionalField = professionalField;
    this.discordID = discordID;
    this.currentPortfolioSize = currentPortfolioSize;
    this.volunteer = volunteer;
    this.ipaddress = ipaddress;

    this.createdOn = createdOn,
      this.createdBy = createdBy
  }

  public investorLevel: string;
  public investmentType: string;
  public tradingTools: string;

  public investingobjective: string;
  public bestCommunicationMethod: string;
  public bestTimeToCall: string;
  public professionalField: string;
  public discordID: string;
  public currentPortfolioSize: string;
  public volunteer: string;
  public ipaddress: string;

  public createdOn: Date;
  public createdBy: string;

  toPlainObj(): {
    investorLevel?: string, investmentType?: string, tradingTools?: string,
    investingobjective?: string, bestCommunicationMethod?: string,
    bestTimeToCall?: string, professionalField?: string,
    discordID?: string, currentPortfolioSize?: string,
    volunteer?: string, ipaddress?: string,
    createdOn?: Date, createdBy?: string
  } {
    return Object.assign({}, this);
  }

}
