import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';


@NgModule({
  imports: [
    FormsModule,
    RouterModule.forChild([
      { path: 'shopping', component: ShoppingListComponent },
    ]),
    SharedModule
  ],
  exports: [],
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent,
  ],
  providers: [],
})
export class ShoppingModule { }
