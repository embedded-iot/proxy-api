var express = require("express");
var router = express.Router();

const { TelegramClient, Api } = require("telegram");

const { StringSession } = require("telegram/sessions");

const stringSession1 = ""; // leave this empty for now
const stringSession =
  "1BQANOTEuMTA4LjU2LjEwNwG7DgXyvbvG6q0qOPuTe8SBHhBWKbVk/JbYldxsik7Z4Pio9epLLQqm43QUcXsocv52v9LMzeWlFuL/5TS2KpXpUgqmlf6t7tLhQIDgcr/dKcB9QRuKAxuGAKedTSQxnDOJMhtRG7YHtg6q5+I5tWFJFhf30nYCy6cz35Bh4Pm4tFFZdp9Dn9mmUDsdRruRMM1mvdcNzV9JGyQcm9o4pJUkaxxdk+w83ItNZDJ3SMkcnGEZlIN3aACwlmOpAgWYhzEcaOifDYZNJE7R+teT9CjUbZK/pz7D/sQKH1BUEO1M6MrmY/Ta/2O44ofHcYhEmOjXBhOhjz5UlsX+4MfKPicL7w=="; // leave this empty for now
// const stringSession = ""; // leave this empty for now
const BOT_TOKEN = "5833837975:AAFeQe67G_NOzIAwH_drF0LOtIeR7iAXeyI"; // put your bot token here
const apiId = 29918589;
const apiHash = "eab996207cd9b7e6e7a526ab85c5a4b3";

const client = new TelegramClient(
  new StringSession(stringSession),
  apiId,
  apiHash,
  { connectionRetries: 5 }
);


/* GET users listing. */
router.get("/connect", async function (req, res, next) {
  await client.start({
      botAuthToken: BOT_TOKEN,
    });
    res.send(client.session.save());
});


/* GET users listing. */
router.get("/data", async function (req, res, next) {
  const { action = '', payload = {} } = req.body;
  if (!!action) {
    try {
      await client.connect();
      const actionArr = action.split('.');
      let method;
      switch (actionArr.length) {
        case 2: method = Api[actionArr[1]]; break;
        case 3: method = Api[actionArr[1]][actionArr[2]]; break;
      }
      const result = await client.invoke(
        new method(payload)
      );
      res.send(result);
    } catch (error) {
      res.status(400).send({ message: 'Error!', error })
    }
  } else {
    res.status(400).send({ message: 'Action param is empty!' })
  }
});

module.exports = router;
