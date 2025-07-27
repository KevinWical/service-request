#!/usr/bin/env ts-node
import "dotenv-defaults/config";
import fs from "fs";
import path from "path";
import { main } from "../src/main";
import { ServiceRequest } from "../src/types";

(async () => {
  try {
    const serviceRequest: ServiceRequest = await main({});

    const logFile = path.resolve(__dirname, "..", "serviceRequest.log");

    const entry = { timestamp: new Date().toISOString(), serviceRequest };
    const line = JSON.stringify(entry) + "\n";

    fs.appendFileSync(logFile, line, "utf8");
    console.log(`Logged service request to ${logFile}`);

    process.exit(0);
  } catch (err: any) {
    console.error("Error during test run:", err);
    process.exit(1);
  }
})();
