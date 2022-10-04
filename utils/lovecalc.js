const fetch = require("node-fetch-commonjs");
module.exports = function lovecalc(reqQuery, callback) {
  const choose = reqQuery.split("-");
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.XRK,
      "X-RapidAPI-Host": "love-calculator.p.rapidapi.com",
    },
  };

  fetch(
    `https://love-calculator.p.rapidapi.com/getPercentage?sname=${encodeURI(
      choose[1].trim()
    )}&fname=${encodeURI(choose[0].trim())}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      callback(response);
    })
    .catch((err) => console.error(err));
};
