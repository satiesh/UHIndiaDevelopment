"use strict";
/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserEntitySelectors = exports.currentUsersDataReducer = void 0;
var current_contextuser_data_action_1 = require("./current-contextuser-data.action");
var current_contextuser_data_state_1 = require("./current-contextuser-data.state");
function currentUsersDataReducer(state, action) {
    if (state === void 0) { state = current_contextuser_data_state_1.initialState; }
    switch (action.type) {
        case current_contextuser_data_action_1.ActionTypes.GET_CURRENT_USER_REQUEST:
        case current_contextuser_data_action_1.ActionTypes.UPDATE_CURRENT_USER_REQUEST:
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_NOTIFICATION_REQUEST:
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_SUBSCRIPTION_REQUEST:
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_PROFILE_REQUEST:
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_OTHERVALUES_REQUEST:
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_DISCLAIMER_REQUEST:
            return __assign(__assign({}, state), { isCurrentUserLoading: true });
        case current_contextuser_data_action_1.ActionTypes.GET_CURRENT_USER_SUCCESS:
            return current_contextuser_data_state_1.adapter.addAll(action.payload, __assign(__assign({}, state), { isCurrentUserLoading: false, isCurrentUserLoaded: true }));
        //case ActionTypes.GET_CURRENT_USER_SUCCESS:
        //  return adapter.addOne(
        //    action.payload,
        //    {
        //      ...state,
        //      isCurrentUserLoading: false,
        //      isCurrentUserLoaded: true
        //    });
        case current_contextuser_data_action_1.ActionTypes.UPDATE_CURRENT_USER_SUCCESS: {
            return current_contextuser_data_state_1.adapter.updateOne({
                id: action.payload.uid,
                changes: action.payload
            }, __assign(__assign({}, state), { isCurrentUserLoading: false, isCurrentUserLoaded: true }));
        }
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_NOTIFICATION_SUCCESS: {
            return current_contextuser_data_state_1.adapter.updateOne({
                id: action.payload.uid,
                changes: action.payload
            }, __assign(__assign({}, state), { isCurrentUserLoading: false, isCurrentUserLoaded: true }));
        }
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_SUBSCRIPTION_SUCCESS: {
            return current_contextuser_data_state_1.adapter.updateOne({
                id: action.payload.uid,
                changes: action.payload
            }, __assign(__assign({}, state), { isCurrentUserLoading: false, isCurrentUserLoaded: true }));
        }
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_PROFILE_SUCCESS: {
            return current_contextuser_data_state_1.adapter.updateOne({
                id: action.payload.uid,
                changes: action.payload
            }, __assign(__assign({}, state), { isCurrentUserLoading: false, isCurrentUserLoaded: true }));
        }
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_OTHERVALUES_SUCCESS: {
            return current_contextuser_data_state_1.adapter.updateOne({
                id: action.payload.uid,
                changes: action.payload
            }, __assign(__assign({}, state), { isCurrentUserLoading: false, isCurrentUserLoaded: true }));
        }
        case current_contextuser_data_action_1.ActionTypes.UPDATE_USER_DISCLAIMER_SUCCESS: {
            return current_contextuser_data_state_1.adapter.updateOne({
                id: action.payload.uid,
                changes: action.payload
            }, __assign(__assign({}, state), { isCurrentUserLoading: false, isCurrentUserLoaded: true }));
        }
        case current_contextuser_data_action_1.ActionTypes.USERS_FAILURE:
            return __assign(__assign({}, state), { isCurrentUserLoading: false, isCurrentUserLoaded: false, error: action.payload.error });
        case current_contextuser_data_action_1.ActionTypes.DELETE_CURRENT_USER_REQUEST:
            return current_contextuser_data_state_1.adapter.removeOne(action.payload.id, state);
        default: {
            return state;
        }
    }
}
exports.currentUsersDataReducer = currentUsersDataReducer;
exports.currentUserEntitySelectors = current_contextuser_data_state_1.adapter.getSelectors();
//# sourceMappingURL=current-contextuser-data.reducer.js.map