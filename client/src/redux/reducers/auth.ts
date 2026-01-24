import {
  GetAuthsStateType,
  SetAuthenticatedActionType,
  SetUnauthenticatedActionType,
  SetUserActionType,
  LoadingUserActionType,
  SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER
} from '../types/AuthTypes';

const initialState: GetAuthsStateType = {
  authenticated: false,
  loading: false,
  credentials: {
    _id: '',
    avatar: '',
    date: '',
    email: '',
    name: '',
    password: '',
  },
};

export const authReducer = (
  state = initialState, 
  action: SetAuthenticatedActionType | SetUnauthenticatedActionType | SetUserActionType | LoadingUserActionType,
) : GetAuthsStateType => {

  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
        return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading:false,
        credentials: action.payload
        // ...action.payload._id
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
