const line = require("@line/bot-sdk");

module.exports = function getProfile(source, callback) {
  const client = new line.Client({
    channelAccessToken: process.env.CAT,
  });
  if (source.groupId) {
    client
      .getGroupMemberProfile(source.groupId, source.userId)
      .then((res) => {
        callback(res);
      })
      .catch(() => {
        return Promise.resolve(null);
      });
  } else {
    client
      .getProfile(source.userId)
      .then((res) => {
        callback(res);
      })
      .catch(() => {
        return Promise.resolve(null);
      });
  }
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
