import { Telegraf, Scenes } from "telegraf";
import LocalSession from "telegraf-session-local";
import { getSimpleScreen } from "./data/get_simple_screen";
import {
  getLevelHelp,
  getMarkup,
  replyError,
  replyUnaccess,
  replyWithPhoto,
  replyWithPhotoFile,
} from "./utils/utils";
import { getFullScreen } from "./data/get_full_screen";
import { ROLES, UserContext } from "./types/types";
import { getUser } from "./data/get_user";
import MARKUPS from "./markups/markups";
import { sendRequestToLog } from "./data/send_request_to_log";
import { generatePages } from "./data/generate_pages";

const main = async () => {
  // Инициализируем бота
  const bot = new Telegraf<UserContext>(process.env.BOT_TOKEN as string);
  const localSession = new LocalSession({
    database: process.env.SESSION_DB as string,
  });

  bot.use(localSession.middleware());

  // Создаем сцены
  const stage = new Scenes.Stage<UserContext>([]);

  // Подключаем сцены к боту
  bot.use(stage.middleware());

  // Определяем роли доступа пользователя
  bot.use((ctx, next) => {
    // Запись в логи
    sendRequestToLog(ctx);

    getUser(ctx.from!.id)
      .then((user) => {
        if (user) {
          ctx.session.roles = user.roles;
          next();
        } else {
          ctx.reply("У Вас нет доступа!");
        }
      })
      .catch((err) => {
        console.log(err);
        ctx.reply("Ошибка доступа!");
      });
  });

  bot.start((ctx) => {
    ctx.reply("Выберите пункт меню!", getMarkup(ctx.session.roles));
  });

  // Добавление нового пользователя
  bot.action(/addUser \|(.+)\| \|(.+)\| \|(.+)\|/, async (ctx) => {
    try {
      const id = ctx.match[1];
      const username = ctx.match[2];
      const fio = ctx.match[3];

      const lineToFile = `${id}|${username}|${fio}\n`;

      ctx.reply(lineToFile);
    } catch (err) {
      console.log(err);
    }
  });

  const pages = await generatePages();

  // Реакция на запрос расчетов по 2DE
  bot.hears(/Расчеты 2DE/i, (ctx) => {
    try {
      ctx.replyWithChatAction("upload_photo");

      if (ctx.session.roles?.includes(ROLES.common)) {
        getSimpleScreen(pages["PRODUCTION"].page)
          .then((image64) =>
            replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
          )
          .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
      } else {
        replyUnaccess(ctx, getMarkup(ctx.session.roles));
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Реакция на запрос экрана с трендом
  bot.hears(/Тренд 2DE/i, (ctx) => {
    try {
      ctx.replyWithChatAction("upload_photo");

      if (ctx.session.roles?.includes(ROLES.common)) {
        getSimpleScreen(pages["TREND"].page)
          .then((image64) =>
            replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
          )
          .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
      } else {
        replyUnaccess(ctx, getMarkup(ctx.session.roles));
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Проверка пользователем на работоспособность
  bot.on("text", (ctx) => {
    ctx.reply("Неизвестная команда", getMarkup(ctx.session.roles));
  });

  bot.launch();
  console.log(`Started ${process.env.BOT_NAME} :: ${new Date()}`);
};

main();
