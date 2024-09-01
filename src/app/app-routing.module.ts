import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { GisComponent } from './components/gis/gis.component';
import { IsothermComponent } from './components/isotherm/isotherm.component';
import { IsobarsComponent } from './components/isobars/isobars.component';
import { IsohumesComponent } from './components/isohumes/isohumes.component';
import { IsohyetsComponent } from './components/isohyets/isohyets.component';
import { IsonephsComponent } from './components/isonephs/isonephs.component';

const routes: Routes = [
  { path: '', redirectTo: '/visualization', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'visualization', component: VisualizationComponent },
  { path: 'isotherms', component: IsothermComponent },
  { path: 'gis', component: GisComponent },
  { path: 'isobars', component: IsobarsComponent },
  { path: 'isohumes', component: IsohumesComponent },
  { path: 'isohyets', component: IsohyetsComponent },
  { path: 'isonephs', component: IsonephsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
