import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpaceportComponent } from './components/spaceport/spaceport.component';
import { PeerToPeerComponent } from './components/peer-to-peer/peer-to-peer.component';
import { P2pTableComponent } from './components/p2p-table/p2p-table.component';

@NgModule({
  declarations: [
    AppComponent,
    SpaceportComponent,
    PeerToPeerComponent,
    P2pTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
