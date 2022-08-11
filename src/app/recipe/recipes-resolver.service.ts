import { switchMap } from 'rxjs/operators';
import { take, map, of } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';

import { Recipe } from './recipe.model';

@Injectable({providedIn: 'root'})

export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
     return this.store.select('recipe').pipe(
      take(1),
      map(recipeState => {
        return recipeState.recipes;
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipeActions.FetchRecipes());

          return this.actions$.pipe(
            ofType(RecipeActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
      )
  }

}
