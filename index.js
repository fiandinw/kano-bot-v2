"use strict";
//require("dotenv").config();
const getProfile = require("./utils/getProfile");
const lovecalc = require("./utils/lovecalc");
const replyAnilist = require("./utils/replyAnilist");

const line = require("@line/bot-sdk");
const express = require("express");

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CAT,
  channelSecret: process.env.CS,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.get("/", (req, res) => {
  res.status(200).json({ info: "nothing was here" });
});

app.post("/line", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  const replyText = (text) => {
    return client.replyMessage(event.replyToken, { type: "text", text });
  };

  if (event.type !== "message" || event.message.type !== "text") {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // clean request
  const reqTrim = event.message.text.trim().toLowerCase();

  if (reqTrim.charAt(0) === "!") {
    // reqVariable
    const reqCommand = reqTrim.toLowerCase().split(" ")[0].slice(1);
    const reqQuery = reqTrim
      .toLowerCase()
      .split(" ")
      .slice(1)
      .join(" ")
      .split("!")[0]
      .trim();
    const reqPage = Number(reqTrim.slice(-1)) || 1;
    console.log(reqCommand, reqQuery, reqPage);

    // commands
    switch (reqCommand) {
      case "anime":
      case "manga":
        replyAnilist(client, event, reqCommand, reqQuery, reqPage, replyText);
        break;
      case "chara":
      case "character":
      case "characters":
        replyAnilist(client, event, "characters", reqQuery, reqPage, replyText);
        break;
      case "seiyu":
      case "seiyuu":
      case "staff":
        replyAnilist(client, event, "staff", reqQuery, reqPage, replyText);
        break;
      // case "anilist":
      //   replyAnilist(client, event, reqCommand, reqQuery, reqPage, replyText);
      //   break;
      case "luck":
        getProfile(event.source.userId, (res) => {
          replyText(
            `Keberuntungan ${res.displayName} ${Math.floor(
              Math.random() * 101
            )}%`
          );
        });
        break;
      case "lovecalc":
        lovecalc(reqQuery, (res) => {
          replyText(
            `${res.fname}\n${String.fromCodePoint(0x2764)} ${
              res.percentage
            }% ${String.fromCodePoint(0x2764)}\n${res.sname}\n\n${res.result}`
          );
        });
        break;
      case "pilih":
      case "chs":
      case "pil":
        const pilih = () => {
          const collection = reqQuery.split("-");
          const choose =
            collection[Math.floor(Math.random() * collection.length)].trim();
          replyText(choose);
        };
        pilih();
        break;
      case "ykh":
      case "apakah":
      case "apkh":
      case "ynm":
        const apakah = () => {
          const collection = ["Ya", "Gak"];
          const choose =
            collection[Math.floor(Math.random() * collection.length)].trim();
          replyText(choose);
        };
        apakah();
        break;

      default:
        replyText(`Perintah ${reqCommand} Belum Ada kak :(`);
        break;
    }
  } else {
    switch (reqTrim) {
      case "kano":
        getProfile(event.source.userId, (res) => {
          replyText(`Hi ${res.displayName} !\n
Commands:
!anime, !manga, !chara, !seiyuu, !ynm, !apakah, !luck,
!chs ini - itu,
!lovecalc aku - dia
<Kano Pre-Stable v1>`);
        });
        break;
      case "kano cantik":
      case "kano lucu":
      case "kano imut":
      case "kano baik":
      case "kano hebat":
      case "kano keren":
        client.replyMessage(event.replyToken, [
          { type: "text", text: "Makasih kak" },
          {
            type: "image",
            originalContentUrl:
              "https://stickershop.line-scdn.net/stickershop/v1/sticker/11235730/android/sticker.png",
            previewImageUrl:
              "https://stickershop.line-scdn.net/stickershop/v1/sticker/11235730/android/sticker.png",
          },
        ]);
        break;
      case "kano jelek":
      case "kano anjing":
      case "kano bangsat":
      case "kano memek":
        client.replyMessage(event.replyToken, [
          { type: "text", text: "Kamu jahat >:(" },
          {
            type: "image",
            originalContentUrl:
              "https://stickershop.line-scdn.net/stickershop/v1/sticker/11235766/android/sticker.png",
            previewImageUrl:
              "https://stickershop.line-scdn.net/stickershop/v1/sticker/11235766/android/sticker.png",
          },
        ]);
        break;
      default:
        return Promise.resolve(null);
        break;
    }
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
