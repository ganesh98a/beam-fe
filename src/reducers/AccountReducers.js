import {
    IP_DATA, SET_EXPLORE_CONDITION
} from '../utilities';
import _ from 'lodash';

const INITIAL_STATE = {
    ip_data: {},
    explore_conditions: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case IP_DATA:
            return {
                ...state,
                ip_data: action.payload
            };
        case SET_EXPLORE_CONDITION:
            var lookup = _.keyBy(action.payload.myConditions, function (o) { return o.conditionId });
            var selectedHealth_condition = _.filter(action.payload.healthConditions, function (list) {
                console.log('SET_EXPLORE_CONDITION', list)

                console.log('SET_EXPLORE_CONDITION-lookup', lookup)
                return lookup[list.id] == undefined;
            });
            console.log('SET_EXPLORE_CONDITION-result', selectedHealth_condition)
            return {
                ...state,
                explore_conditions: selectedHealth_condition
            };

        default:
            return state;
    }
};