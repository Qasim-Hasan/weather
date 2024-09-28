import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { GisComponent } from './components/gis/gis.component';
import { IsobarsComponent } from './components/isobars/isobars.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { AuthGuard } from './guards/auth.guard'; // Import the AuthGuard

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginpageComponent },
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] }, // Protect this route
  { path: 'visualization', component: VisualizationComponent, canActivate: [AuthGuard] }, // Protect this route
  { path: 'gis', component: GisComponent, canActivate: [AuthGuard] }, // Protect this route
  { path: 'isobars', component: IsobarsComponent, canActivate: [AuthGuard] }, // Protect this route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule{}
