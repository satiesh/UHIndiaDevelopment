/**
 * @author satiesh darmaraj
 * created on 01/29/2019
 */
export class Courses {

  constructor(
    id?: string,Name?: string,CourseDescription?: string,
    IsActive?: boolean,Price?: number,
    StartDate?: Date,CreatedOn?: Date,
    CreatedBy?: string,Schedule?: string,Prerequisites?: string,
    GeneralAudience?: string, CourseAudience?: string, Agenda?: string, Instructor?: string,
    ShortDescription?: string,NumberofSessions?: string)
 {

    this.id= id;
    this.Name= Name;
    this.CourseDescription= CourseDescription;
    this.IsActive= IsActive;
    this.Price= Price;
    this.StartDate= StartDate;
    this.CreatedOn= CreatedOn;
    this.CreatedBy= CreatedBy;
    this.Schedule= Schedule;
    this.Prerequisites= Prerequisites;
    this.GeneralAudience= GeneralAudience;
    this.CourseAudience= CourseAudience;
    this.Agenda= Agenda;
    this.Instructor= Instructor;
    this.ShortDescription= ShortDescription;
    this.NumberofSessions= NumberofSessions;
  }

  public Name: string;
  public CourseDescription: string;
  public IsActive: boolean;
  public Price: number;
  public StartDate: Date;
  public CreatedOn: Date;
  public CreatedBy: string;
  public Schedule: string;
  public Prerequisites: string;
  public GeneralAudience: string;
  public CourseAudience: string;
  public Agenda: string;
  public Instructor: string;
  public ShortDescription: string;
  public NumberofSessions: string;
  public id: string;

  toPlainObj(): {
    id?: string, Name?: string, CourseDescription?: string,
    IsActive?: boolean, Price?: number,
    StartDate?: Date, CreatedOn?: Date,
    CreatedBy?: string,Schedule?: string, Prerequisites?: string,
    GeneralAudience?: string, CourseAudience?: string, Agenda?: string, Instructor?: string,
    ShortDescription?: string, NumberofSessions?: string
  } {
    return Object.assign({}, this);
  }

}
