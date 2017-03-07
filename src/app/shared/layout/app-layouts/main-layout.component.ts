import { Component, OnInit } from '@angular/core';
import {FadeZoomInTop} from '../../animations/fade-zoom-in-top.decorator';
import {LayoutService} from '../layout.service';
@FadeZoomInTop()
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styles: []
})
export class MainLayoutComponent implements OnInit {

  constructor(public layoutService:LayoutService) { }

  ngOnInit() {
    this.layoutService.onFixedHeader();
    this.layoutService.onFixedNavigation();
    this.layoutService.onFixedPageFooter();
  }

}
