export enum AccountState {
  STALLED = "STALLED",
  CONFIRMING = "CONFIRMING",
  PAID = "PAID",
  BANNED = "BANNED",
}

export interface App {
  id: string;
  name?: string;
  storeLinks?: { ios: string; android: string };
  customer?: Client;
  builds?: Build[];
  logo?: string;
  template?: Template;
  color?: { color: string; text: "black" | "white" };
}

export interface AppGen extends Omit<App, "id"> {
  id?: string;
}

export interface Build {
  id: string;
  date?: Date;
  app?: App;
  state: BuildState;
}

export enum BuildState {
  STALLED = "STALLED",
  QUEUED = "QUEUED",
  GENERATING = "GENERATING",
  UPLOADING = "UPLOADING",
  PUBLISHED = "PUBLISHED",
  WAITING = "WAITING",
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  state?: AccountState;
  apps?: App[];
  payments?: Payment[];
}

export interface Payment {
  id: string;
  initial: Date;
  until: Date;
  concept: string;
  quantity: number;
  confirmed: boolean;
}

export interface Template {
  id: string;
  gitUrl?: string;
  previewImg?: string;
  name?: string;
}
