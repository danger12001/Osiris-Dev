namespace Database {
  export type Profiles = {
    id: string;
    FirstName: string;
    LastName: string;
    IdNumber: string;
    RiskLevel: 0 | 1 | 2 | 3 | 4 | 5;
  }
}

export default Database
