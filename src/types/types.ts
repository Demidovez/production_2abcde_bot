import { NarrowedContext, Scenes, Types } from "telegraf";
import puppeteer from "puppeteer";

export type CTX = NarrowedContext<
  Scenes.SceneContext<Scenes.SceneSessionData> & {
    match: RegExpExecArray;
  },
  Types.MountMap["text"]
>;

export interface User {
  roles: string[];
}

export interface UserSession {
  roles?: string[];
  __scenes: any;
}

export interface UserContext extends Scenes.SceneContext {
  session: UserSession;
}

export const ROLES = {
  unregistered: "unregistered",
  common: "common",
  virabotka: "virabotka",
};

export enum EMarkup {
  common,
  virabotka,
}

export enum EPageType {
  photo,
  file,
}

export interface IScreen {
  link: string;
  type: EPageType;
}

export interface IUserData {
  user_id: number;
  screens: IScreen[];
}

export interface IPages {
  [key: string]: {
    type: EPageType;
    page: puppeteer.Page;
  };
}
