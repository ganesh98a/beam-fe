import { combineReducers } from 'redux';
import LoginReducers from './LoginReducers';
import HeaderReducers from './HeaderReducers';
import RegisterReducers from './RegisterReducers';
import WorkoutReducers from './WorkoutReducers';
import InstructorReducers from './InstructorReducers';
import AccountReducers  from './AccountReducers';
import LiveClassReducers  from './LiveClassReducers';
import GroupReducers  from './GroupReducers';
import DashboardReducers from './DashboardReducers';
import programmeReducer from './programmeReducer';
export default combineReducers({
  auth: LoginReducers,
  header: HeaderReducers,
  register: RegisterReducers,
  workout: WorkoutReducers,
  programme: programmeReducer,
  instructor: InstructorReducers,
  accountinfo: AccountReducers,
  liveclass: LiveClassReducers,
  group: GroupReducers,
  dashboard: DashboardReducers,
});
