# Бот данных по 2DE

Прослушивание кнопки:

```
bot.hears(/Тренд/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  if (ctx.session.roles?.includes(ROLES.common)) {
    getSimpleScreen(SCREENS.TREND)
      .then((image64) =>
        replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
      )
      .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  } else {
    replyUnaccess(ctx, getMarkup(ctx.session.roles));
  }
});
```
