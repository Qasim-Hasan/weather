import { Component } from '@angular/core';

@Component({
  selector: 'app-drawerpage',
  templateUrl: './drawerpage.component.html',
  styleUrls: ['./drawerpage.component.css']
})
export class DrawerpageComponent {
  isDrawerOpen: boolean = false; // Track whether the drawer is open or closed

  hoverDrawer(isHovering: boolean): void {
    if (isHovering) {
      this.isDrawerOpen = true; // Open the drawer on hover
    } else {
      this.isDrawerOpen = false; // Close the drawer when not hovered
    }
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen; // Toggle the drawer's open state
  }

  closeDrawer(): void {
    this.isDrawerOpen = false; // Method to close the drawer
  }
}
