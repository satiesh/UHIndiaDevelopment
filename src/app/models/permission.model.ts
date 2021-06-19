// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export type PermissionNames =
  'View Users' | 'Manage Users' |
  'View Users Personnel Information' | 'Manage Users Personnel Information' |

  'View Users Role Information' | 'Manage Users Role Information' |
  'View Users Subscription Information' | 'Manage Users Subscription Information' |
  'View Users Payment Information' | 'Manage Users Payment Information' |
  'View Users Trading Tools Information' | 'Manage Users Trading Tools Information' |
  'View Users Investment Type Information' | 'Manage Users Investment Type Information' |
  'View Users Invester Level Information' | 'Manage Users Invester Level Information' |
  'View Users Other Information' | 'Manage Users Other Information' |
  'View Users Disclaimer Information' |
  'View Roles' | 'Manage Roles' | 'Assign Roles'|
  'View Subscriptions' | 'Manage Subscriptions' |
  'View Stock of the Day' | 'Manage Stock of the Day' |
  'View Option Trade' | 'Manage Option Trade' | 'Delete Option Trade' |
  'Manage Daily Trade' |
  'View Coupons' | 'Manage Coupons' |
  'View Templates' | 'Manage Templates';

export type PermissionValues =
  'users.view' | 'users.manage' |
  'users.view.personnel' | 'users.manage.personnel' |
  'users.view.role' | 'users.manage.role' |
  'users.view.subscription' | 'users.manage.subscription' |
  'users.view.payment' | 'users.manage.payment' |
  'users.view.tradingtools' | 'users.manage.tradingtools' |
  'users.view.investmenttype' | 'users.manage.investmenttype' |
  'users.view.investerlevel' | 'users.manage.investerlevel' |
  'users.view.others' | 'users.manage.others' |
  'users.view.disclaimer' | 'users.manage.disclaimer' |
  'roles.view' | 'roles.manage' | 'roles.assign' |
  'courses.view' | 'courses.manage' |
  'subscriptions.view' | 'subscriptions.manage' |
  'stockoftheday.view' | 'stockoftheday.manage' |
  'optiontrade.view' | 'optiontrade.manage' | 'optiontrade.delete' |
  'dailytrade.manage' |
  'coupons.view' | 'coupons.manage' |
'templates.view' | 'templates.manage';

export class Permission {
  public static readonly viewCoursesPermission: PermissionValues = 'courses.view';
  public static readonly manageCoursesPermission: PermissionValues = 'courses.manage';

  public static readonly viewUsersPermission: PermissionValues = 'users.view';
  public static readonly manageUsersPermission: PermissionValues = 'users.manage';

  public static readonly viewUsersPersonnelPermission: PermissionValues = 'users.view.personnel';
  public static readonly manageUsersPersonnelPermission: PermissionValues = 'users.manage.personnel';

  public static readonly viewUsersRolePermission: PermissionValues = 'users.view.role';
  public static readonly manageUsersRolePermission: PermissionValues = 'users.manage.role';

  public static readonly viewUsersSubscriptionPermission: PermissionValues = 'users.view.subscription';
  public static readonly manageUsersSubscriptionPermission: PermissionValues = 'users.manage.subscription';

  public static readonly viewUsersPaymentPermission: PermissionValues = 'users.view.payment';
  public static readonly manageUsersPaymentPermission: PermissionValues = 'users.manage.payment';

  public static readonly viewUsersTradingToolsPermission: PermissionValues = 'users.view.tradingtools';
  public static readonly manageUsersTradingToolsPermission: PermissionValues = 'users.manage.tradingtools';

  public static readonly viewUsersInvestmentTypePermission: PermissionValues = 'users.view.investmenttype';
  public static readonly manageUsersInvestmentTypePermission: PermissionValues = 'users.manage.investmenttype';

  public static readonly viewUsersInvesterLevelPermission: PermissionValues = 'users.view.investerlevel';
  public static readonly manageUsersInvesterLevelPermission: PermissionValues = 'users.manage.investerlevel';

  public static readonly viewUsersOthersPermission: PermissionValues = 'users.view.others';
  public static readonly manageUsersOthersPermission: PermissionValues = 'users.manage.others';

  public static readonly viewUsersDisclaimerPermission: PermissionValues = 'users.view.disclaimer';
  public static readonly manageUsersDisclaimerPermission: PermissionValues = 'users.manage.disclaimer';



  public static readonly viewRolesPermission: PermissionValues = 'roles.view';
  public static readonly manageRolesPermission: PermissionValues = 'roles.manage';
  public static readonly assignRolesPermission: PermissionValues = 'roles.assign';

  public static readonly viewSubscriptions: PermissionValues = 'subscriptions.view';
  public static readonly manageSubscriptions: PermissionValues = 'subscriptions.manage';

  public static readonly viewStockoftheday: PermissionValues = 'stockoftheday.view';
  public static readonly manageStockoftheday: PermissionValues = 'stockoftheday.manage';

  public static readonly viewOptionTrade: PermissionValues = 'optiontrade.view';
  public static readonly manageOptionTrade: PermissionValues = 'optiontrade.manage';
  public static readonly deleteOptionTrade: PermissionValues = 'optiontrade.delete';

  public static readonly manageDailyTrade: PermissionValues = 'dailytrade.manage';

  public static readonly viewCoupons: PermissionValues = 'coupons.view';
  public static readonly manageCoupons: PermissionValues = 'coupons.manage';

  public static readonly viewTemplates: PermissionValues = 'templates.view';
  public static readonly manageTemplates: PermissionValues = 'templates.manage';

  constructor(name?: PermissionNames, value?: string, description?: string,
    isActive?: boolean, createdBy?: string, createdOn?: Date) {
    this.Name = name;
    this.Value = value;
    this.Description = description;
    this.IsActive= isActive;
    this.CreatedBy= createdBy;
    this.CreatedOn = createdOn;
    this.Assigned = false;
  }
  public id: string;
  public Name: string;
  public Value: string;
  public Description: string;
  public IsActive: boolean;
  public CreatedBy: string;
  public CreatedOn: Date;
  public Assigned: boolean=false;

  toPlainObj(): {
    Name?: string, Value?: string, Description?: string,
    IsActive?: boolean, CreatedBy?: string, CreatedOn?: Date,Assigned?:boolean} {
    return Object.assign({}, this);
  }
} 
