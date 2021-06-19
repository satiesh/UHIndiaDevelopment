/**
 * @author satiesh darmaraj
 * created on 02/07/2019
 */
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { CoursesStoreSelectors } from './course-data';
import { RolesStoreSelectors } from './role-data';
import { PermissionsStoreSelectors } from './permission-data';
import { SubscriptionStoreSelectors } from './subscription-data';
import { InvestmentTypesStoreSelectors } from './investmenttypes-data';
import { InvestorLevelStoreSelectors } from './investorlevel-data';
import { TradingToolsStoreSelectors } from './tradingtools-data';


export const selectError: MemoizedSelector<object, string> = createSelector(
  CoursesStoreSelectors.selectError,
  RolesStoreSelectors.getRoleError,
  PermissionsStoreSelectors.getPermissionError,
  SubscriptionStoreSelectors.selectError,
  InvestmentTypesStoreSelectors.getInvestmentTypesError,
  InvestorLevelStoreSelectors.getInvestorLevelError,
  TradingToolsStoreSelectors.getTradingToolsError,
  (coursesDataError: string,  rolessDataError: string,
    permissionsDataError: string, subscriptionDataError: string, investmenttypesDataError: string,
    investorlevelDataError: string, tradingtoolsDataError: string) =>
{
    return coursesDataError  || rolessDataError || permissionsDataError
      || subscriptionDataError || investmenttypesDataError || investorlevelDataError || tradingtoolsDataError
});

export const selectIsLoading: MemoizedSelector<
  object,
  boolean
  > = createSelector(
    CoursesStoreSelectors.selectCoursesLoading,
    RolesStoreSelectors.getRoleLoading,
    PermissionsStoreSelectors.getPermissionLoading,
    SubscriptionStoreSelectors.selectSubscriptionsLoading,
    InvestmentTypesStoreSelectors.getInvestmentTypesLoading,
    InvestorLevelStoreSelectors.getInvestorLevelLoading,
    TradingToolsStoreSelectors.getTradingToolsLoading,
    (coursesDataLoading: boolean,  rolesDataLoading: boolean,
      permissionsDataLoading: boolean, subscriptionDataLoading: boolean, investmenttypesDataLoading: boolean,
      investorlevelDataLoading: boolean, tradingtoolsDataLoading: boolean) => {
      return coursesDataLoading  || rolesDataLoading
        || permissionsDataLoading || subscriptionDataLoading || investmenttypesDataLoading
        || investorlevelDataLoading || tradingtoolsDataLoading         
    }
  );
