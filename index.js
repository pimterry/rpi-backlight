var path = require('path');
var fs = require('fs');

var backlightPath = '/sys/class/backlight/rpi-backlight';

function writeValue(fileName, value) {
    return new Promise(function (resolve, reject) {
        var fullPath = path.join(backlightPath, fileName);
        fs.writeFile(fileName, value, function(err) {
             if (err !== null) reject(err);
             else resolve();
        });
    });
}

if (!fs.existsSync(backlightPath)) {
    throw new Error('Backlight control not supported (' + backlightPath + ' does not exist)');
}

exports.powerOn = function () {
    return writeValue('bl_power', '0');
};

exports.powerOff = function () {
    return writeValue('bl_power', '1');
};
