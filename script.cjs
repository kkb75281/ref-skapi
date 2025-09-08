const fs = require("fs");
const path = require("path");
const https = require("https");

const downloadList = [
    {
        url: "https://docs.skapi.com/skapi.md",
        filename: "skapi.md",
    },
    {
        url: "https://docs.skapi.com/skapi-types.md",
        filename: "skapi-types.md",
    },
    {
        url: "https://docs.skapi.com/SYSTEM.md",
        filename: "SYSTEM.md",
    },
];

function downloadFile(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    https
        .get(url, (response) => {
            if (response.statusCode !== 200) {
                cb(
                    new Error(`Failed to get '${url}' (${response.statusCode})`)
                );
                return;
            }
            response.pipe(file);
            file.on("finish", () => {
                file.close(cb);
            });
        })
        .on("error", (err) => {
            fs.unlink(dest, () => cb(err));
        });
}

function downloadDocs() {
    const downloadDir = path.join(__dirname, "src/assets/download");
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
    }

    downloadList.forEach(({ url, filename }) => {
        const dest = path.join(downloadDir, filename);
        downloadFile(url, dest, (err) => {
            if (err) {
                console.error(`Error downloading ${filename}:`, err);
            } else {
                console.log(`Downloaded ${filename} to ${dest}`);
            }
        });
    });
}
downloadDocs();

// Read file synchronously
let productionDate = fs.readFileSync(".env.production", "utf8");
let developmentDate = fs.readFileSync(".env.development", "utf8");
let date = new Date();
let newDate = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

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
