import twilio from "twilio";

import { config } from "dotenv";
config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

export const client = twilio(accountSid, authToken);
