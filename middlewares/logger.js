const morgan = require("morgan");


morgan.token("total-time", function (req, res) {
  return `${Date.now() - req.startTime} ms`; // Time since request start
});


const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  next();
};


const logger = morgan((tokens, req, res) => {
 
    return [
        `[${new Date().toLocaleString()}]`,  
        `"${tokens.method(req, res)}"`,      
        tokens.url(req, res),                
        `Status: ${tokens.status(req, res)}`,
        `Size: ${tokens.res(req, res, "content-length") || "0"} bytes`, 
        `⏳ Time: ${tokens["total-time"](req, res)}` 
      ].join(" | ");  
    })
      

module.exports = { logger, requestTimer };
