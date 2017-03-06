import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { IDrugs } from '../drugs';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {


  drugs: IDrugs[];
  public currentPage: number = 1;

  constructor(private service: InventoryService) { }

  ngOnInit() {
    this.service.getDrugs().subscribe(
      response => this.drugs = response,
      error => console.error(error)
    )
  }
}
