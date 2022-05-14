import Jimp from "jimp";
import puppeteer from "puppeteer";

export const getSimpleScreen = async (
  page: puppeteer.Page
): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      await page
        .screenshot({
          encoding: "base64",
          type: "jpeg",
          quality: 100,
          fullPage: true,
        })
        .then((image) => {
          Jimp.read(Buffer.from(image.toString("base64"), "base64"))
            .then((image) => {
              image
                .crop(430, 0, 1080, 1080)
                .quality(100)
                .getBase64(Jimp.MIME_JPEG, (err, src) => {
                  if (err) {
                    reject(err);
                  } else {
                    const result = src.replace(/^data:image\/jpeg;base64,/, "");

                    resolve(result);
                  }
                });
            })
            .catch((err) => reject(err));
        });
    } catch (err) {
      reject(err);
    }
  });
};
