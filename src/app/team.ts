export class Team {
    id : number; 
    name: string;
    RBs : [];
    WRs : [];
    QBs : [];
    TEs : [];
    flex : [];
    DST : [];
    kicker : [];
    bench : [];
    teamSize : number;

    constructor (id) {
        this.id = id;
        this.name = `Team ${id}`;
        this.RBs = [];
        this.WRs = [];
        this.QBs = [];
        this.TEs = [];
        this.DST = [];
        this.kicker = [];
        this.flex = [];
        this.bench = [];
    }
}