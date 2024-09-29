import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerpageComponent } from '../drawerpage/drawerpage.component';
import {AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
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
