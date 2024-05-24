const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

// * Files
// Blocking, sync way
/*
const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${new Date(Date.now())}`;
fs.writeFileSync('./txt/output.txt', textOut);

const readTextOut = fs.readFileSync('./txt/output.txt','utf8');
console.log(readTextOut)
*/

// Non-blocking, async way
/*
fs.readFile('./txt/start.txt', 'utf8', (err, data1) => {
  if (err) return console.log('error happened');
  fs.readFile(`./txt/${data1}.txt`, 'utf8', (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, 'utf8', (err, data3) => {
      console.log(data3);

      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf8', err => {
        console.log('Your file has been written');
      });
    });
  });
});
*/

// * Server

// top level code - executed once the program is run

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8",
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8",
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf8",
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/overview" || pathname === "/") {
    // Overview page

    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((product) => replaceTemplate(templateCard, product))
      .join("");

    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    // Product page
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);

    res.end(output);
  } else if (pathname === "/api") {
    // API
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(3000, "localhost", () => {
  console.log(`Server is listening on port: 8000`);
});
