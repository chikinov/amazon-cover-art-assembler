const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const http = require('http');
const path = require('path');
const { Transform } = require('stream');

if (process.argv.length < 3) {
    console.log('Usage: node ' + path.basename(__filename) + ' asin');
    process.exit(1);
} else {
    var asin = process.argv[2];
}

function assembleImages(x = 0, y = 0) {
    http.get('http://z2-ec2.images-amazon.com/R/1/a=' + asin + '+c=A17SFUTIVB227Z+d=_SCR(3,' + x + ',' + y + ')', function(res) {
        if (res.statusCode != 200)
            return;

        var data = new Transform();
        res.on('data', function(chunk) {
            data.push(chunk);
        });
        res.on('end', function() {
            if (!fs.existsSync('temp')) {
                fs.mkdirSync('temp');
            }
            fs.writeFileSync(path.join('temp', x + '-' + y + '.jpg'), data.read(), 'binary');
            if (++y > 3) {
                if (++x > 3) {
                    var g = gm();
                    for (i = 0; i < 4; i++) {
                        for (j = 0; j < 4; j++) {
                            g = g.in('-page', '+' + (i * 400) + '+' + (j * 400)).in(path.join('temp', i + '-' + j + '.jpg'));
                        }
                    }
                    g.mosaic().write(asin + '.png', function (err) {
                        if (err) console.log(err);
                    });
                    return;
                } else {
                    y = 0;
                }
            }
            assembleImages(x, y);
        });
    });
}

assembleImages();
