import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-draftboard',
  templateUrl: './draftboard.component.html',
  styleUrls: ['./draftboard.component.css']
})
export class DraftboardComponent implements OnInit {
  @Input() pickOrder: [];
  @Input() myTeamID: any;

  constructor() { }

  ngOnInit(): void {
  }

}
