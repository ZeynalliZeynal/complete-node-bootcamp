const EventEmitter = require("events");
const http = require("http");

// const myEmitter = new EventEmitter();

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("new sale");
});

myEmitter.on("newSale", () => {
  console.log("new sale event 2");
});

myEmitter.on("newSale", (stock) => {
  console.log(`Amount of items left: ${stock}`);
});

myEmitter.emit("newSale", 9);

const server = http.createServer();
server.on("request", (req, res) => {
  res.end("Request received");
});

server.on("request", (req, res) => {
  console.log("Another Request received");
});

server.on("close", () => {
  console.log("Server closed");
});

server.listen(8000, "localhost", () => {
  console.log("Listening to requests");
});
