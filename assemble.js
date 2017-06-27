const fs = require('fs');
const http = require('http');
const Jimp = require('jimp');
const path = require('path');

if (process.argv.length > 2) {
    var asin = process.argv[2];
    var zoomLevel = process.argv.length > 3 ? process.argv[3] : 3;
} else {
    console.log('Usage: node ' + path.basename(__filename) + ' asin zoomlevel');
    process.exit(1);
}

function assembleImages(x = 0, y = 0, image = new Jimp(600, 600)) {
    Jimp.read('http://z2-ec2.images-amazon.com/R/1/a=' + asin + '+c=A17SFUTIVB227Z+d=_SCR(' + zoomLevel + ',' + x + ',' + y + ')', function (err, img) {
        if (err) throw err;

        var w = Math.max(img.bitmap.width + x * 400, image.bitmap.width);
        var h = Math.max(img.bitmap.height + y * 400, image.bitmap.height);
        image.contain(w, h, Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP);
        image.composite(img, x * 400, y * 400);

        if (++y > zoomLevel) {
            if (++x > zoomLevel) {
                image.write(asin + '.png');
                return;
            } else {
                y = 0;
            }
        }
        assembleImages(x, y, image);
    });
}

assembleImages();
