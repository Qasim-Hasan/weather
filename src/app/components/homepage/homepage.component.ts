
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerpageComponent } from '../drawerpage/drawerpage.component';
import {AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {
  @ViewChild(DrawerpageComponent) drawerPageComponent!: DrawerpageComponent;

  ngAfterViewInit() {
    // Access drawerPageComponent here
    if (!this.drawerPageComponent) {
      console.error('DrawerPageComponent not found!');
    }
  }

  toggleDrawer() {
    if (this.drawerPageComponent) {
      this.drawerPageComponent.toggleDrawer(); // Toggle drawer open/close
    } else {
      console.error('DrawerPageComponent not found!');
    }
  }
}
