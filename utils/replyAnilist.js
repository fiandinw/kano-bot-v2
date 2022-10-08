const anilist = require("./anilist");
module.exports = function replyAnilist(
  client,
  event,
  reqCommand,
  reqQuery,
  reqPage,
  replyText
) {
  const paginationTemplate = {
    type: "template",
    altText: "This is a buttons template",
    template: {
      type: "buttons",
      text:
        (reqCommand + " " + reqQuery).substring(0, 100) + " page " + reqPage,
      defaultAction: {
        type: "message",
        label: "next",
        text: `!${reqCommand} ${reqQuery} !${Number(reqPage) + 1}`,
      },
      actions: [
        {
          type: "message",
          label: "Back",
          text: `!${reqCommand} ${reqQuery} !${Number(reqPage) - 1}`,
        },
        {
          type: "message",
          label: "Next",
          text: `!${reqCommand} ${reqQuery} !${Number(reqPage) + 1}`,
        },
      ],
    },
  };

  const replyCarouselMedia = (arr, pages) => {
    return client.replyMessage(event.replyToken, [
      {
        type: "template",
        altText: "Anilist",
        template: {
          type: "carousel",
          columns: arr.map((el) => ({
            thumbnailImageUrl: el.coverImage.large,
            title: el.title.romaji.substring(0, 40),
            text: (el.title.english || el.title.native).substring(0, 60),
            defaultAction: {
              type: "uri",
              label: "anilist",
              uri: el.siteUrl,
            },
            actions: [
              {
                type: "message",
                label: "Details",
                text: `${el.siteUrl}`,
              },
            ],
          })),
        },
      },
      ...[pages != 1 && paginationTemplate],
    ]);
  };

  const replyCarouselImage = (arr, pages) => {
    return client.replyMessage(event.replyToken, [
      {
        type: "template",
        altText: "Anilist",
        template: {
          type: "image_carousel",
          columns: arr.map((el) => ({
            imageUrl: el.image.large,
            action: {
              type: "message",
              label: el.name.full.substring(0, 10) + "..",
              text: `${el.siteUrl}`,
            },
          })),
        },
      },
      ...[pages != 1 && paginationTemplate],
    ]);
  };

  switch (reqCommand) {
    case "anime":
    case "manga":
      anilist(reqQuery, reqCommand, reqPage, (res) => {
        if (res.data.Page.media.length !== 0) {
          replyCarouselMedia(res.data.Page.media, res.data.Page.pageInfo.total);
        } else {
          replyText("Gak Ketemu...");
        }
      });
      break;
    case "characters":
      anilist(reqQuery, reqCommand, reqPage, (res) => {
        if (res.data.Page.characters.length !== 0) {
          replyCarouselImage(
            res.data.Page.characters,
            res.data.Page.pageInfo.total
          );
        } else {
          replyText("Gak Ketemu...");
        }
      });
      break;
    case "staff":
      anilist(reqQuery, reqCommand, reqPage, (res) => {
        if (res.data.Page.staff.length !== 0) {
          replyCarouselImage(res.data.Page.staff, res.data.Page.pageInfo.total);
        } else {
          replyText("Gak Ketemu...");
        }
      });
      break;
    default:
      break;
  }
};
