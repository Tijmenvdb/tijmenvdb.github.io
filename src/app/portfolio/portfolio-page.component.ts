import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-portfolio-page',
  imports: [RouterModule],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.scss'
})
export class PortfolioPageComponent implements AfterViewInit {

    constructor(private route: ActivatedRoute) {}
  
    ngAfterViewInit(): void {
      const fragment = this.route?.snapshot?.fragment;
      document.getElementById(fragment?? '')?.scrollIntoView();
    }
}
