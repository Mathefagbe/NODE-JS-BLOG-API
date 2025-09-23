const http = require("http");
const app = require("./app");
const connetMongodb = require("./init/mongodb");
const { port } = require("./config/keys");
const initializeCategory = require("./init/loadCategory");
const initializeTags = require("./init/loadTags");

//create server
const server = http.createServer(app);

//connect database
connetMongodb();

//auto load category
// initializeCategory();
// initializeTags();

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
