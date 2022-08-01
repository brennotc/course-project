import * as fromShopping from '../shopping/store/shopping.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';


export interface AppState {
  shopping: fromShopping.State;
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shopping: fromShopping.ShoppingReducer,
  auth: fromAuth.authReducer
};
