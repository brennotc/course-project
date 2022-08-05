import { Router } from '@angular/router';
import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { of, tap } from 'rxjs';
import { Injectable } from '@angular/core';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
  return new AuthActions.AuthenticateSuccess(
    {email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate}
  );
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred';

  if(!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch(errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct';
      break;
  }

  return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()

export class AuthEffects {

  authSignup = createEffect(() => {
    return this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
          return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCep9PeeJQNEhJa26flcpr5GqkVcBtFOgg',
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
          })
          .pipe(
            map((resData: AuthResponseData) => {
              return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }),
            catchError(errorRes => {
             return handleError(errorRes);
          }));
        })
        );
  }, { dispatch: true });

  authLogin = createEffect(() => {
    return this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
          return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          })
          .pipe(
            map((resData: AuthResponseData) => {
              return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }),
            catchError(errorRes => {
              return handleError(errorRes);
          }))
        })
        );
  }, { dispatch: true });

  authSuccess = createEffect(() => {
    return this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        }));
  }, { dispatch: false });

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
