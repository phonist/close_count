// import {
//   REGISTER_SUCCESS,
//   //REGISTER_FAIL,
//   USER_LOADED,
//   AUTH_ERROR,
//   LOGIN_SUCCESS,
//   //LOGIN_FAIL,
//   LOGOUT,
//   ACCOUNT_DELETED
// } from '../types/AuthTypes';
import {
  REGISTER,
  LOGIN,
  LOGOUT,
  LOADED_USER,
  GetAuthsStateType,
  LogoutActionType,
  LoginActionType,
  RegisterActionType,
  LoadUserActionType
} from '../types/AuthTypes';

const initialState: GetAuthsStateType = {
  auth: {
    _id: '',
    avatar: '',
    date: '',
    email: '',
    name: '',
    password: ''
  },
  token: '',
  isAuthenticated: false,
  loading: true,
  error: ""
};

export const authReducer = (
  state = initialState, 
  action: LogoutActionType | LoginActionType | RegisterActionType | LoadUserActionType,
) : GetAuthsStateType => {

  switch (action.type) {
    case REGISTER:
      return {
        ...state,
        auth: action.payload,
        isAuthenticated: true, 
        loading: false,
      };
    case LOGIN:
      return {
        ...state,
        auth: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case LOADED_USER:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        auth: action.payload
      };
    // case REGISTER_SUCCESS:
    // case LOGIN_SUCCESS:
    //   return {
    //     ...state,
    //     ...payload,
    //     isAuthenticated: true,
    //     loading: false
    //   };
    // case ACCOUNT_DELETED:
    // case AUTH_ERROR:
    case LOGOUT:
      return {
        ...state,
        token: initialState.token,
        isAuthenticated: false,
        loading: false,
        auth: initialState.auth
      };
    default:
      return state;
  }
}
