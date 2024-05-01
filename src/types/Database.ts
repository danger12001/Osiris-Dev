namespace Database {
  export type Profiles = {
    id: string;
    FirstName: string;
    LastName: string;
    IdNumber: string;
    RiskLevel: 0 | 1 | 2 | 3 | 4 | 5;
  }
  export type Incidents = {
    id: string;
    IdNumber: string;
    IncidentDate: Date;
    IncidentDescription: string;
  }
}

export default Database
