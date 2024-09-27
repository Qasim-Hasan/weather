import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { GisComponent } from './components/gis/gis.component';
import { IsobarsComponent } from './components/isobars/isobars.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginpageComponent},
  { path: 'homepage', component: HomepageComponent },
  { path: 'visualization', component: VisualizationComponent },
  { path: 'gis', component: GisComponent },
  { path: 'isobars', component: IsobarsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule{}
