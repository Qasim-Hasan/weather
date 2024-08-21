
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerpageComponent } from '../drawerpage/drawerpage.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  @ViewChild(DrawerpageComponent) drawerPageComponent!: DrawerpageComponent;
  toggleDrawer() {
    if (this.drawerPageComponent) {
      if (this.drawerPageComponent.isDrawerOpen) {
        this.drawerPageComponent.closeDrawer();
      } else {
        this.drawerPageComponent.openDrawer();
      }
    } else {
      console.error('DrawerPageComponent not found!');
    }
  }
}
