import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from '../team';
import { RosterComponent } from '../roster/roster.component';
import { NgModule } from '@angular/core';
import { DraftboardComponent } from '../draftboard/draftboard.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css']
})
export class DraftComponent implements OnInit {
  @NgModule({
    declarations: [RosterComponent, DraftboardComponent]
  })
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  url = 'https://cors-anywhere.herokuapp.com/https://fantasyfootballcalculator.com/api/v1/adp/ppr?teams=12&year=2020';
  players : [];
  rawData : any;

  availablePlayers;
  yourTurnToPick = false;
  filterPlayers = 'all';

  numTeams = 10;
  myTeamID = 1; 
  
  numRounds = 16; 

  teams = [];
  pickHistory = [];
  pickOrder = [];
  currentPick = 0;

  // positions
  rbAmount = 2;
  wrAmount = 2;
  qbAmount = 1;
  teAmount = 1;
  flexAmount = 2;
  dstAmount = 1;
  kickerAmount = 1;
  benchAmount = 6;

  draftType = 'PPR';

  constructor (private http: HttpClient, private modalService: NgbModal) {
    this.getDraftData();
    this.initializeTeams(this.numTeams);
  }

  ngOnInit(): void {
    this.modalService.open(this.content);
  }

  async getDraftData() {
    await this.http.get(this.url).toPromise().then(data => {
      this.rawData = data;
    });
    this.players = this.rawData.players;
    this.availablePlayers = this.rawData.players;
  }

  initializeTeams(amountOfTeams) {
    this.teams = [];
    for (let i = 1;  i <= amountOfTeams; i++) {
      let newTeam = new Team(i);
      this.teams.push(newTeam);
    }
  }

  initializePickOrder(numTeams) {
    let roundNumber= 1;
    for (let i = roundNumber; i <= this.numRounds; i++) {
      let pickNumber = 1;

      if (roundNumber % 2 === 0) {
        for (let j = numTeams; j >= 1; j--) {
          this.pickOrder.push({
            round: roundNumber,
            pick: pickNumber,
            team: j
          })
          pickNumber++;
        }
      } else {
        for (let j = 1; j <= numTeams; j++) {
          this.pickOrder.push({
            round: roundNumber,
            pick: pickNumber,
            team: j
          })
          pickNumber++;
        }
      }

      roundNumber++;
    }
    
    //calculate number of rounds
    this.numRounds = this.rbAmount + this.wrAmount + this.qbAmount + this.teAmount
    + this.flexAmount + this.dstAmount + this.kickerAmount + this.benchAmount;

    this.startDraft();
  }

  pickPlayer(player) {
    for (let i = 0; i < this.availablePlayers.length; i++) {
      if (player.player_id === this.availablePlayers[i].player_id) {
        this.addPlayerToTeam(this.availablePlayers[i], this.myTeamID);
        this.pickOrder[this.currentPick].player = this.availablePlayers[i].name;
        this.availablePlayers.splice(i,1);
      }
    }
    this.nextPick();
  }

  addPlayerToTeam(player, teamID) {

    if (player.position === 'RB') {
      if (this.teams[teamID-1].RBs.length < this.rbAmount) {
        this.teams[teamID-1].RBs.push(player.name);
      } else if (this.teams[teamID-1].flex.length < this.flexAmount) {
        this.teams[teamID-1].flex.push(player.name);
      } else if (this.teams[teamID-1].bench.length < this.benchAmount) {
        this.teams[teamID-1].bench.push(player.name);
      }
    }
    if (player.position === 'WR') {
      if (this.teams[teamID-1].WRs.length < this.wrAmount) {
        this.teams[teamID-1].WRs.push(player.name);
      } else if (this.teams[teamID-1].flex.length < this.flexAmount) {
        this.teams[teamID-1].flex.push(player.name);
      } else if (this.teams[teamID-1].bench.length < this.benchAmount) {
        this.teams[teamID-1].bench.push(player.name);
      }
    }
    if (player.position === 'TE') {
      if (this.teams[teamID-1].TEs.length < this.teAmount) {
        this.teams[teamID-1].TEs.push(player.name);
      } else if (this.teams[teamID-1].flex.length < this.flexAmount) {
        this.teams[teamID-1].flex.push(player.name);
      } else if (this.teams[teamID-1].bench.length < this.benchAmount) {
        this.teams[teamID-1].bench.push(player.name);
      }
    }
    if (player.position === 'QB') {
      if (this.teams[teamID-1].QBs.length < this.qbAmount) {
        this.teams[teamID-1].QBs.push(player.name);
      } else if (this.teams[teamID-1].bench.length < this.benchAmount) {
        this.teams[teamID-1].bench.push(player.name);
      }
    }
    if (player.position === 'DEF') {
      if (this.teams[teamID-1].DST.length < this.dstAmount) {
        this.teams[teamID-1].DST.push(player.name);
      } else if (this.teams[teamID-1].bench.length < this.benchAmount) {
        this.teams[teamID-1].bench.push(player.name);
      }
    }
    if (player.position === 'PK') {
      if (this.teams[teamID-1].kicker.length < this.kickerAmount) {
        this.teams[teamID-1].kicker.push(player.name);
      } else if (this.teams[teamID-1].bench.length < this.benchAmount) {
        this.teams[teamID-1].bench.push(player.name);
      }
    }
    if (player.position === 'PK') {

    }
    if (player.position === 'DEF') {
     
    }
  }


  autoPick() {
    let num = Math.floor(Math.random() * Math.floor(4));
    this.pickOrder[this.currentPick].player = this.availablePlayers[num].name;
    this.availablePlayers.splice(num,1);
    this.nextPick();
  }

  startDraft() {
    if (this.myTeamID === 1) {
      this.yourTurnToPick = true;
    } else {
      this.autoPick();
    }
  }

  nextPick() {
    this.currentPick++;
    if (this.pickOrder[this.currentPick].team === this.myTeamID) {
      this.yourTurnToPick = true;
    } else {
      this.yourTurnToPick = false;
      setTimeout(() => { this.autoPick() }, 700);
    }
  }

  filterPlayerPosition(playerType) {
    if (playerType === 'all') this.filterPlayers = 'all';
    if (playerType === 'RBs') this.filterPlayers = 'RBs';
    if (playerType === 'WRs') this.filterPlayers = 'WRs';
    if (playerType === 'QBs') this.filterPlayers = 'QBs';
    if (playerType === 'TEs') this.filterPlayers = 'TEs';
    if (playerType === 'K') this.filterPlayers = 'K';
    if (playerType === 'DST') this.filterPlayers = 'DST';
  }

  increment(playerType) {
    if (playerType === 'QB') this.qbAmount++;
    if (playerType === 'RB') this.rbAmount++;
    if (playerType === 'WR') this.wrAmount++;
    if (playerType === 'TE') this.teAmount++;
    if (playerType === 'FLEX') this.flexAmount++;
    if (playerType === 'DST') this.dstAmount++;
    if (playerType === 'KICKER') this.kickerAmount++;
    if (playerType === 'BENCH') this.benchAmount++;
    if (playerType === 'TEAMS') this.numTeams++;
    if (playerType === 'PICK') this.myTeamID++;
  }

  decrement(playerType) {
    if (playerType === 'QB') this.qbAmount--;
    if (playerType === 'RB') this.rbAmount--;
    if (playerType === 'WR') this.wrAmount--;
    if (playerType === 'TE') this.teAmount--;
    if (playerType === 'FLEX') this.flexAmount--;
    if (playerType === 'DST') this.dstAmount--;
    if (playerType === 'KICKER') this.kickerAmount--;
    if (playerType === 'BENCH') this.benchAmount--;
    if (playerType === 'TEAMS') this.numTeams--;
    if (playerType === 'PICK') this.myTeamID--;
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
 
    }, (reason) => {
 
    });
  }

  counter(i: number) {
    return new Array(i);
  }
}
