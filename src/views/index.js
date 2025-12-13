const vscode = require("vscode");
const fs = require('fs');
const path = require('path');
const pkg = require("../../package.json");
const { parseTemplate } = require("xhtml-to-json");

let getCodeFactory = function (pagename) {
    return function (dotName) {
        return fs.readFileSync(path.join(__dirname, "./pages/" + pagename + "/index." + dotName), 'utf8');
    };
};

let normalizeCode = fs.readFileSync(path.join(__dirname, "./libs/normalize.css"), 'utf8');
let iconCode = fs.readFileSync(path.join(__dirname, "./libs/mins/@oipage/stylecss/icon.css"), 'utf8');
let commonCode = fs.readFileSync(path.join(__dirname, "./common.scss"), 'utf8');
let visliteCode = fs.readFileSync(path.join(__dirname, "./libs/mins/vislite.js"), 'utf8');
let zipaperCode = fs.readFileSync(path.join(__dirname, "./libs/mins/zipaper.js"), 'utf8');
let bridgeCode = fs.readFileSync(path.join(__dirname, "./libs/bridge.js"), 'utf8');

module.exports = function (context, webview, pagename) {
    let getCode = getCodeFactory(pagename);
    const imagesPath = vscode.Uri.joinPath(context.extensionUri, 'images');

    const templateCode = parseTemplate(
        getCode("html")
            .replaceAll("${images}", webview.asWebviewUri(imagesPath)) // 图片路径
            .replaceAll("${version}", pkg.version) // 版本号
    ).toJson();
    const styleCode = getCode("scss");
    const scriptCode = getCode("js");

    // 拼接页面
    return `<!DOCTYPE html>
<html lang="zh-cn">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auxiliary / ${pagename}</title>
    <style>${normalizeCode}</style>
    <style>${iconCode}</style>
    <style>${commonCode}</style>
    <script>${visliteCode}</script>
    <script>${zipaperCode}</script>
    <script>${bridgeCode}</script>
</head>

<body>
    <div id="root"></div>
    <script>
        let vscode = acquireVsCodeApi();
        let bridge = bridgeFactory(window,vscode);
        ${scriptCode
            .replace(/export +default +/, "let App = ")
            .replace(/import +style +from +(["'])\.\/index.scss\1;?/, `let style = ${JSON.stringify(styleCode)};`) // import style from "./index.scss"            
            .replace(/import +template +from +(["'])\.\/index.html\1;?/, `let template = ${JSON.stringify(templateCode, null, 2)};`) // import template from "./index.html";
            .replace(/import ({.+}) from (["'])zipaper\2;?/, "let $1 = Zipaper;") // import { defineElement } from "zipaper";
            .replace(/import ({.+}) from (["'])vislite\2;?/, "let $1 = VISLite;") // import { Canvas } from "vislite";
        }
        if(App) Zipaper.createApp(App).mount(document.getElementById("root"));
    </script>
</body>

</html>`;
};