import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { P2pTableComponent } from './components/p2p-table/p2p-table.component';
import { PeerToPeerComponent } from './components/peer-to-peer/peer-to-peer.component';
import { SpaceportComponent } from './components/spaceport/spaceport.component';


const routes: Routes = [
  {path: '', component: P2pTableComponent},
  {path: 'example', component: PeerToPeerComponent},
  {path: 'port', component: SpaceportComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
