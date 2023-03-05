// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  if (req.method === "PUT") {
    req.body.updatedAt = Date.now();
  }
  if (
    req.path.startsWith("/users") &&
    req.headers["authorization"] !== "Bearer token"
  ) {
    return res.sendStatus(401).json({ message: "Unauthorized" });
  }
  // Continue to JSON Server router
  next();
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
