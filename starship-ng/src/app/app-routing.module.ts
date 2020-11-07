import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeerToPeerComponent } from './components/peer-to-peer/peer-to-peer.component';
import { SpaceportComponent } from './components/spaceport/spaceport.component';


const routes: Routes = [
  {path: '', component: PeerToPeerComponent},
  {path: 'port', component: SpaceportComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
