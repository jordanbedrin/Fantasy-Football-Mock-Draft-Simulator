import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})
export class RosterComponent implements OnInit {
  @Input() qbAmount: number;
  @Input() rbAmount: number;
  @Input() wrAmount: number;
  @Input() teAmount: number;
  @Input() flexAmount: number;
  @Input() dstAmount: number;
  @Input() kickerAmount: number;
  @Input() benchAmount: number;
  @Input() teams;
  @Input() myTeamID;

  constructor() { }

  ngOnInit(): void {
  }

  counter(i: number) {
    return new Array(i);
  }

}
