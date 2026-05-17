import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import 'dotenv/config';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], 
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
      ],
    }),
    slidingWindow({
      mode: "LIVE",
      max: 10,
      interval: "60s", // 10 requests per 60 seconds
    })
  ],
});

export default aj;