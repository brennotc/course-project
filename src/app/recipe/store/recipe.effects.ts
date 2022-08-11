import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RecipeActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';

@Injectable()

export class RecipeEffects {

  fetchRecipes = createEffect(() => {
    return this.actions$.pipe(
        ofType(RecipeActions.FETCH_RECIPES),
        switchMap(() => {
          return this.http.get<Recipe[]>(
            'https://course-project-86b4a-default-rtdb.firebaseio.com/recipes.json')
        }),
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        map(recipes => {
          return new RecipeActions.SetRecipes(recipes);
        })
        );
  }, { dispatch: true });

  storeRecipes = createEffect(() => {
    return this.actions$.pipe(
        ofType(RecipeActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipe')),
        switchMap(([actionData, recipeState]) => {
          return this.http.put('https://course-project-86b4a-default-rtdb.firebaseio.com/recipes.json', recipeState.recipes)
        })
        );
  }, {dispatch: false});

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}
