// console.log(arguments);
// console.log(require("module").wrapper);

const Calculator = require("./test-module-1");
const calc1 = new Calculator();

console.log(calc1.add(2, 5));

const { add, divide, multiply } = require("./test-module-2");
console.log(divide(5, 2));

// caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
