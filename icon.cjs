const fs = require("fs");
const path = require("path");
const glob = require("glob");

// 모든 vue 파일 찾기 (views와 components 폴더)
const targetFiles = [
    ...glob.sync(path.join(__dirname, "./src/views/**/*.vue")),
    ...glob.sync(path.join(__dirname, "../src/components/**/*.vue")),
];

// 버전 문자열 생성 (날짜 또는 커밋 해시 등)
const version = new Date().toISOString().replace(/[-:.TZ]/g, "");

// 두 종류의 아이콘 경로 모두 처리
const iconRegexList = [
    /(\/basic-icon\.svg)(#icon-[\w-]+)/g,
    /(\/material-icon\.svg)(#icon-[\w-]+)/g,
];

targetFiles.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");
    iconRegexList.forEach((regex) => {
        content = content.replace(regex, `$1?v=${version}$2`);
    });
    fs.writeFileSync(file, content, "utf8");
    console.log(`Updated icons in: ${file}`);
});
