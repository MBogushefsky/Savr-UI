import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnInit {

  guageValue = 88;
  guageColors: any[] = [
    {
      from: 0,
      to: 33,
      color: "#f31700",
    },
    {
      from: 33,
      to: 66,
      color: "#ffc000",
    },
    {
      from: 66,
      to: 100,
      color: "#37b400",
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
