import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatButtonModule, MatTableModule, MatCard} from '@angular/material';



import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    MatCard
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
