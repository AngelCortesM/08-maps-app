const { writeFileSync, mkdirSync } = require("fs");

require("dotenv").config();

const targetPath = "./src/environments/environment.ts";
const targetPathDev = "./src/environments/environment.development.ts";
const mapboxKey = process.env["MAPBOX_KEY"];
if (!mapboxKey) {
  throw new Error("MAPBOX_KEY is not defined in .env file");
}

const envFileContent = `export const environment = {
  mapboxKey: "${mapboxKey}",
};`;

mkdirSync("./src/environments", { recursive: true });
writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);
