import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DraftComponent } from './draft/draft.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RosterComponent } from './roster/roster.component';
import { DraftboardComponent } from './draftboard/draftboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DraftComponent,
    RosterComponent,
    DraftboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
