//* Location API Types for Country, State, and City
export interface Country {
  name: string;
  iso2: string;
  long: number;
  lat: number;
}

export interface State {
  name: string;
  state_code: string;
}

export type City = string[];

export interface LocationResponse<T> {
  error: boolean;
  msg: string;
  data: T;
}
