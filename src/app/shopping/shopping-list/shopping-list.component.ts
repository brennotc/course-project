import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import * as fromShopping from '../store/shopping.reducer';
import * as ShoppingActions from '../store/shopping.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private igChangeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shopping');
    // this.ingredients = this.shoppingService.getIngredients();
    // this.igChangeSub = this.shoppingService.ingredientsChanged.subscribe((ingredientsUpdated: Ingredient[]) => {
    //   this.ingredients = ingredientsUpdated;
    // })
  }

  ngOnDestroy(): void {
    // this.igChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
    // this.shoppingService.startedEditing.next(index);
    this.store.dispatch(new ShoppingActions.StartEdit(index));

  }

}
