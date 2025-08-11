const fs = require("fs");

// Read file synchronously
let productionDate = fs.readFileSync(".env.production", "utf8");
let developmentDate = fs.readFileSync(".env.development", "utf8");
let date = new Date();
let newDate = date.toLocaleString();

productionDate = productionDate.replace(
    /(VITE_DATE\s*=\s*")[^"]*(")/,
    `$1${newDate}$2`
);
developmentDate = developmentDate.replace(
    /(VITE_DATE\s*=\s*")[^"]*(")/,
    `$1Development - ${newDate}$2`
);

fs.writeFileSync(".env.production", productionDate);
fs.writeFileSync(".env.development", developmentDate);
