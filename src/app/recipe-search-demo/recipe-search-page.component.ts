import { Component } from '@angular/core';
import { DrawerComponent } from '../shared/components/drawer/drawer.component';
import { NavBarComponent } from '../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-recipe-search-page',
  imports: [DrawerComponent],
  templateUrl: './recipe-search-page.component.html',
  styleUrl: './recipe-search-page.component.scss'
})
export class RecipeSearchPageComponent {
  isDrawerOpen = [false, false, false, false, false];

  toggleDrawer(isOpen: boolean, index: number): void {
    this.isDrawerOpen[index] = isOpen;
  }
}
