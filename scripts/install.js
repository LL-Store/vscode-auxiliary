const { copyDisk } = require("oipage/nodejs/disk/index.js");

copyDisk("./node_modules/vislite/lib/index.umd.min.js", "./src/views/libs/mins/vislite.js", true);
copyDisk("./node_modules/@oipage/stylecss/src", "./src/views/libs/mins/@oipage/stylecss", true);
copyDisk("./node_modules/zipaper/dist/Zipaper.min.js", "./src/views/libs/mins/zipaper.js", true);