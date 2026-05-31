import { initDB } from "./db";
import app from "./app";
import config from "./config";
const main = () => {
    initDB();
    app.listen(config.port, () => {
        console.log(`App listening from port ${config.port}`);
    });
};
main();
//# sourceMappingURL=server.js.map