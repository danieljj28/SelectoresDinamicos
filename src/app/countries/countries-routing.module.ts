import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { SelectorPageComponent } from './pages/selector-page/selector-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', component: SelectorPageComponent
      },
      {
        path: '**', redirectTo: 'selector'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountriesRoutingModule {}
