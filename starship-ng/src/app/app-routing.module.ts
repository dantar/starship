import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpaceportComponent } from './components/spaceport/spaceport.component';


const routes: Routes = [
  {path: '', component: SpaceportComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
