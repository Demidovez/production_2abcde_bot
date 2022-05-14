import { Markup } from "telegraf";

const COMMON = [["Расчеты 2DE", "Тренд 2DE"]];

export default {
  COMMON: Markup.keyboard(COMMON).resize(),
};
