import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from '../team';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css']
})
export class DraftComponent implements OnInit {
  url = 'https://cors-anywhere.herokuapp.com/https://fantasyfootballcalculator.com/api/v1/adp/ppr?teams=12&year=2020';
  players : [];
  rawData;

  availablePlayers;
  yourTurnToPick = false;

  currentRoundNumber;

  //change to allow user input
  numTeams = 10;
  //change to allow user input
  myTeamID = 2;
  //change to allow user input
  numRounds = 14; 

  teams = [];
  pickHistory = [];
  pickOrder = [];
  currentPick = 0;

  //change to allow user inputÅ
  rbAmount = 2;
  wrAmount = 2;
  qbAmount = 1;
  teAmount = 1;
  flexAmount = 2;
  dstAmount = 1;
  kickerAmount = 1;
  benchAmount = 6;

  draftType = 'PPR';


  constructor(private http: HttpClient) {
    this.getDraftData();
    this.initializeTeams(this.numTeams);
    this.initializePickOrder(this.numTeams);
    console.log(this.teams);
    console.log('pickOrder', this.pickOrder);
  }

  ngOnInit(): void {
  }

  async getDraftData() {
    await this.http.get(this.url).toPromise().then(data => {
      this.rawData = data;
    });
    this.players = this.rawData.players;
    this.availablePlayers = this.rawData.players;
    console.log(this.players);
  }

  initializeTeams(amountOfTeams) {
    for (let i = 1;  i <= amountOfTeams; i++) {
      let newTeam = new Team(i);
      // if ()
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
    let num = Math.floor(Math.random() * Math.floor(5));
    console.log("num", num);
    console.log(this.availablePlayers[num]);
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
      this.autoPick();
    }
  }

  counter(i: number) {
    return new Array(i);
  }
}