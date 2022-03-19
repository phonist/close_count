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
} from '../types/AuthTypes';

const initialState: GetAuthsStateType = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  auth: {
    _id: '',
    avatar: '',
    date: '',
    email: '',
    name: '',
    password: ''
  }
};

export const authReducer = (
  state = initialState, 
  action: LogoutActionType | LoginActionType | RegisterActionType,
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
        user: payload
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
        token: null,
        isAuthenticated: false,
        loading: false,
        auth: null
      };
    default:
      return state;
  }
}
