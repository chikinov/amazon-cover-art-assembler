const fs = require('fs');
const http = require('http');
const Jimp = require('jimp');
const path = require('path');

if (process.argv.length < 3) {
    console.log('Usage: node ' + path.basename(__filename) + ' asin');
    process.exit(1);
} else {
    var asin = process.argv[2];
}

function assembleImages(x = 0, y = 0, image = new Jimp(1448, 1448)) {
    Jimp.read('http://z2-ec2.images-amazon.com/R/1/a=' + asin + '+c=A17SFUTIVB227Z+d=_SCR(3,' + x + ',' + y + ')', function (err, img) {
        if (err) throw err;

        image.composite(img, x * 400, y * 400);

        if (++y > 3) {
            if (++x > 3) {
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
