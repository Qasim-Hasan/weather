import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GisComponent } from './components/gis/gis.component';
import { IsothermComponent } from './components/isotherm/isotherm.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { HeaderpageComponent } from './components/headerpage/headerpage.component';
import { FooterpageComponent } from './components/footerpage/footerpage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { DrawerpageComponent } from './components/drawerpage/drawerpage.component';
import { SliderComponent } from './components/visualization/slider/slider.component';
import { OptionCardsComponent } from './components/visualization/option-cards/option-cards.component';
import { IsobarsComponent } from './components/isobars/isobars.component';
import { IsohumesComponent } from './components/isohumes/isohumes.component';
import { IsohyetsComponent } from './components/isohyets/isohyets.component';
import { IsonephsComponent } from './components/isonephs/isonephs.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
// Import HttpClientModule
import { HttpClientModule } from '@angular/common/http';
// Services
import { CsvDataService } from './services/csv/csv-data.service';
import { IsobarImageDataService } from './services/image/isobar-image-data.service';
import { IsobarService } from './services/geojson/isobar.service';
import { IsothermService } from './services/geojson/isotherm.service';
import { MapComponent } from './components/map/map.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule


@NgModule({
  declarations: [
    AppComponent,
    GisComponent,
    IsothermComponent,
    HomepageComponent,
    HeaderpageComponent,
    FooterpageComponent,
    VisualizationComponent,
    DrawerpageComponent,
    SliderComponent,
    OptionCardsComponent,
    IsobarsComponent,
    IsohumesComponent,
    IsohyetsComponent,
    IsonephsComponent,
    MapComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, // Add this line
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [CsvDataService, IsobarImageDataService ,IsobarService,IsothermService],
  bootstrap: [AppComponent],
})
export class AppModule {}
