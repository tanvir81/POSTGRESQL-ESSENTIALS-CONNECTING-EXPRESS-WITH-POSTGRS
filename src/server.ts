import app from "./app";
import config from "./config";
import { initDB } from "./db";

// ? <--------------------App Connector------------->
const main = async () => {
  initDB();

  app.listen(config.port, () => {
    console.log(`Express app listening on port ${config.port}`);
  });
};

main();
