import { Markup, Telegraf } from "telegraf";
import {
  InlineKeyboardMarkup,
  Message,
  ReplyKeyboardMarkup,
} from "telegraf/typings/core/types/typegram";
import { CTX, EPageType, IScreen, ROLES, UserContext } from "../types/types";
import MARKUPS from "../markups/markups";
import { getSimpleScreen } from "../data/get_simple_screen";
import { getFullScreen } from "../data/get_full_screen";
import { getUsersForSendData } from "../data/get_users_for_send_data";
import puppeteer from "puppeteer";

export const replyWithPhoto = (
  ctx: CTX,
  image64: string,
  markup?: Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup>
): Promise<Message.PhotoMessage> => {
  return ctx.replyWithPhoto(
    {
      source: Buffer.from(image64, "base64"),
    },
    {
      reply_markup: markup?.reply_markup,
    }
  );
};

export const replyWithPhotoFile = (
  ctx: CTX,
  image64: string,
  caption: string,
  markup?: Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup>
): Promise<Message.DocumentMessage> => {
  return ctx.replyWithDocument(
    {
      source: Buffer.from(image64, "base64"),
      filename: "image.jpg",
    },
    {
      reply_markup: markup?.reply_markup,
      caption: caption,
    }
  );
};

export const replyError = (
  ctx: CTX,
  err: any,
  markup?: Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup>
) => {
  console.log(err);

  ctx.reply(`Ошибка`, markup);
};

export const replyUnaccess = (
  ctx: CTX,
  markup?: Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup>
) => {
  ctx.reply(`У вас нет доступа!`, markup);
};

export const getLevelHelp = (): string => {
  return `
СМ1 - Бак сульфатного мыла 1
СМ2 - Бак сульфатного мыла 2
ТМ1 - Бак таллового масла 1
ТМ2 - Бак таллового масла 2

СЩ1 - Бак слабого щелока 1
СЩ2 - Бак слабого щелока 2
ЩС - Бак щелока для сжигания
КЩ - Бак крепкого щелока
СЩ - Бак сливного щелока
ПЩ - Бак промежуточного щелока
СМ - Бак сульфатного мыла

ЧБЩ - Бак чистого белого щелока
МЗЩ - Бак мутного зеленого щелока
ОЗЩ - Бак очищенного зеленого щелока
ОИ - Бункер обоженной извести
ИК - Бункер известкового камня
СБЩ - Бак слабого белого щелока
ИШ - Бак известкового шлама
  `;
};

export const getMarkup = (
  roles?: string[]
): Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup> => {
  if (roles && roles.includes(ROLES.common)) {
    return MARKUPS.COMMON;
  } else {
    return MARKUPS.COMMON;
  }
};

export const sendDataInterval = (
  bot: Telegraf<UserContext>,
  period: number,
  page: puppeteer.Page,
  secondsDelay: number = 0
) => {
  const now = new Date();

  // Количество мс для интервала
  const delay = period * 3600 * 1000;

  // Количество часов до первого запуска
  const countHours = period - (now.getHours() % period);

  // Количество мс до первого запуска
  const msToNextPeriod = Math.round(
    new Date(now.getTime() + countHours * 3600 * 1000).setMinutes(0, 0, 0) -
      now.getTime()
  );

  // Запускаем первый раз с последующим интервалом (с дополнительной задержкой)
  setTimeout(() => {
    sendScreens();

    setInterval(sendScreens, delay + secondsDelay * 1000);
  }, msToNextPeriod + secondsDelay * 1000);

  const sendScreens = async () => {
    const usersData = await getUsersForSendData(period);

    let screens: IScreen[] = [];

    // Извлекаем все уникальные экраны
    usersData.map((userData) =>
      userData.screens.map((screen) => {
        const isExistScreen = screens.some(({ link }) => link === screen.link);

        if (!isExistScreen) {
          screens.push(screen);
        }
      })
    );

    // bot.telegram.sendChatAction(321438949, "upload_photo");

    // Выгружаем экраны
    screens.map((screen) => {
      const getScreen =
        screen.type === EPageType.photo ? getSimpleScreen : getFullScreen;

      getScreen(page)
        .then((image64) => {
          // Загружаем всем пользователям экраны (если они на них подписаны)
          usersData.map((userData) => {
            if (userData.screens.some(({ link }) => link === screen.link)) {
              bot.telegram.sendPhoto(userData.user_id, {
                source: Buffer.from(image64, "base64"),
              });
            }
          });
        })
        .catch((err) => console.log(err));
    });
  };
};
