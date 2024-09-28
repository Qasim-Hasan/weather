import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GisComponent } from './components/gis/gis.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { HeaderpageComponent } from './components/headerpage/headerpage.component';
import { FooterpageComponent } from './components/footerpage/footerpage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { DrawerpageComponent } from './components/drawerpage/drawerpage.component';
import { IsobarsComponent } from './components/isobars/isobars.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
// Import HttpClientModule
import { HttpClientModule } from '@angular/common/http';
// Services
import { CsvDataService } from './services/csv/csv-data.service';
import { IsobarImageDataService } from './services/image/isobar-image-data.service';
import { IsobarService } from './services/geojson/isobar.service';
import { MapComponent } from './components/map/map.component';
import { FormsModule } from '@angular/forms';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { SignuppageComponent } from './components/signuppage/signuppage.component';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/loginpage/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    GisComponent,
    HomepageComponent,
    HeaderpageComponent,
    FooterpageComponent,
    VisualizationComponent,
    DrawerpageComponent,
    IsobarsComponent,
    MapComponent,
    LoginpageComponent,
    SignuppageComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [CsvDataService, IsobarImageDataService ,IsobarService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
