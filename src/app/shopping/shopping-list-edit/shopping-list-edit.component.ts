import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Store } from '@ngrx/store';
import * as ShoppingActions from "../store/shopping.actions";
import * as fromShopping from '../store/shopping.reducer';
import * as fromApp from '../../store/app.reducer';


@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) shoppingForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.subscription = this.store.select('shopping').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.shoppingForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const ingredientAdd = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.shoppingService.updateIngredient(this.editedItemIndex, ingredientAdd);

      this.store.dispatch(new ShoppingActions.UpdateIngredient(ingredientAdd))
    } else {
      //this.shoppingService.addIngredient(ingredientAdd);

      this.store.dispatch(new ShoppingActions.AddIngredient(ingredientAdd));
    }

    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoppingForm.reset();
    this.editMode = false;

    this.store.dispatch(new ShoppingActions.StopEdit());
  }

  onDelete() {
    // this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingActions.DeleteIngredient());
    this.onClear();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingActions.StopEdit());
  }

}
