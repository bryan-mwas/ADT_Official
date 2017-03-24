import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { Order, Facility } from './orders';
import { Observable } from 'rxjs/Observable';
import { PaginationInstance } from 'ng2-pagination';

declare var $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public state: any = {
    tabs: {
      demo1: 0,
      demo2: 'tab-r1',
      demo3: 'hr1',
      demo4: 'AA',
      demo5: 'iss1',
      demo6: 'l1',
      demo7: 'tab1',
      demo8: 'hb1',
      demo9: 'A1',
      demo10: 'is1'
    }
  }

  // pagination controls
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1
  };
  public labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };

  cdrrList: Order[];
  cdrr = new Order();
  mapsList: Order[];
  maps = new Order();
  private facilityDetails: Observable<String[]>;
  binding: string;
  show_items: number;
  filter_period: any[];
  filter_period_maps: any[];
  monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  period_begin_filter: string = 'all';
  period_begin_maps_filter: string = 'all';

  constructor(private _ordersService: OrdersService) { }

  ngOnInit(): void {
    this._ordersService.getCdrrOrderDetails().subscribe((data: Order[]) => {
      this.cdrrList = data;
      // Array with period_begin only
      let period_begin: any[] = data.map(item => item.period_begin);
      this.filter_period = this.isolatePeriodDates(period_begin).sort().reverse();
    });
    this._ordersService.getMapOrderDetails().subscribe(data => {
      this.mapsList = data;
      let period_map_begin: any[] = data.map(item => item.period_begin);
      this.filter_period_maps = this.isolatePeriodDates(period_map_begin).sort().reverse();
    });
    this._ordersService.getFacilityDetails().subscribe(data => this.facilityDetails = data);
  }
  /**
   * Isolates the unique dates from the period begin values
   */
  isolatePeriodDates(period_begin: any[]) {
    let unique = {};
    let distinct = [];
    let res = []; // Holds arrays resulting from the split operation hence, it is multi-dimnsional in nature
    period_begin.forEach((element) => {
      res.push(element.split("-"));
    });
    let combined = [];
    // i is the date from the respective list
    for (let i in res) {
      // Creates a list of the dates i.e Month - Year
      // parseInt => Clears the preceeding 0 in a number
      combined.push(this.monthsList[parseInt(res[i][1], 10) - 1] + '-' + res[i][0]);
    }
    // unique and distinct; Both are used to produce an array with distinct values
    for (var i in combined) {
      if (typeof (unique[combined[i]]) == "undefined") {
        distinct.push(combined[i]);
      }
      unique[combined[i]] = 0;
    }
    // This property is iterated over at the filter period
    return distinct;
    // console.log(this.distinct)
  }
  /**
   * 
   * @param date 
   */
  filterPeriod(date: string) {
    // Gives an array with [0] -> Month && [1] -> Year
    date.split('-');
    let period_begin: any[] = this.cdrrList.map(item => item.period_begin);
    period_begin.forEach(el => console.log(new Date(el).getFullYear()))
    console.log(period_begin)
  }

  /**
   * 
   * @param number 
   */

  onPageChange(number: number) {
    console.log('change to page', number);
    this.config.currentPage = number;
  }

}
