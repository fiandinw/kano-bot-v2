const line = require("@line/bot-sdk");

module.exports = function getProfile(userId, callback) {
  const client = new line.Client({
    channelAccessToken: process.env.CAT,
  });

  client
    .getProfile(userId)
    .then((res) => {
      callback(res);
    })
    .catch(() => {
      return Promise.resolve(null);
    });
  // .then((profile) => {
  //   console.log(profile.displayName);
  //   console.log(profile.userId);
  //   console.log(profile.pictureUrl);
  //   console.log(profile.statusMessage);
  // })
  // .catch((err) => {
  //   // error handling
  // });
};
