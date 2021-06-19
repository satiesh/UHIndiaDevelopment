/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { CoursesStoreState } from './course-data';
import { UsersStoreState } from './user-data';
import { RolesStoreState } from './role-data';
import { PermissionsStoreState } from './permission-data';
import { SubscriptionStoreState } from './subscription-data';
import { InvestmentTypesStoreState } from './investmenttypes-data'
import { InvestorLevelStoreState } from './investorlevel-data';
import { TradingToolsStoreState } from './tradingtools-data';
import { DailyTradeStoreState } from './dailytrade-data';
import { CurrentUsersStoreState } from './currentuser-data';
import { ChannelStoreState } from './channel-data';
import { OptionsTradeStoreState } from './optionstrade-data';
import { UserOptionTradeStoreState } from './useroptiontrade-data';
import { QuestionStoreState } from './question-data';
import { CouponStoreState } from './coupon-data';
import { TemplateStoreState } from './template-data';

export interface State {
  coursesData: CoursesStoreState.State;
  usersData: UsersStoreState.State;
  rolesData: RolesStoreState.State;
  permissionsData: PermissionsStoreState.State,
  subscriptionData: SubscriptionStoreState.State
  investmenttypesData: InvestmentTypesStoreState.State
  investorlevelData: InvestorLevelStoreState.State
  tradetoolsData: TradingToolsStoreState.State,
  dailyrradeData: DailyTradeStoreState.State,
  currentUsersData: CurrentUsersStoreState.State,
  currentChannelData: ChannelStoreState.State,
  optionTradeData: OptionsTradeStoreState.State,
  userOptionTradeData: UserOptionTradeStoreState.State,
  questionData: QuestionStoreState.State,
  couponData: CouponStoreState.State,
  templateData: TemplateStoreState.State,


}
