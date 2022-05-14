import axios from "axios";
import { UserContext } from "../types/types";

export const sendRequestToLog = async (ctx: UserContext) => {
  new Promise(async () => {
    try {
      // TODO: Проверить на асинхонность (чтобы не было очереди)

      const from = ctx.message?.from.id;
      const text = (ctx.message as any).text;
      const botUserName = ctx.botInfo.username;

      console.log(from, text, botUserName);
    } catch (err) {
      console.log(err);
    }
  });
};
