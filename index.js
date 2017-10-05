var path = require('path');
var fs = require('fs');

var backlightPath = '/sys/class/backlight/rpi_backlight';

function writeValue(fileName, value) {
    return new Promise((resolve, reject) => {
        var fullPath = path.join(backlightPath, fileName);
        fs.writeFile(fullPath, value, (err) => {
            if (err !== null) reject(err);
            else resolve();
        });
    });
}

function readValue(fileName, value) {
    return new Promise((resolve, reject) => {
        var fullPath = path.join(backlightPath, fileName);
        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err !== null) reject(err);
            else resolve(data);
        });
    });
}

if (!fs.existsSync(backlightPath)) {
    throw new Error('Backlight control not supported (' + backlightPath + ' does not exist)');
}

/** Power managment */
exports.powerOn = () => {
    return writeValue('bl_power', '0');
};

exports.powerOff = () => {
    return writeValue('bl_power', '1');
};

exports.isPoweredOn = () => {
    return readValue('bl_power').then((powerValue) => parseInt(powerValue, 10) === 0);
};

/** Brightness managment */
exports.getBrightness = () => {
    return readValue('actual_brightness').then((brightnessValue) => parseInt(brightnessValue, 10));
};

exports.setBrightness = (value) => {
    return this.getMaxBrightness().then((maxBrightnessValue) => writeValue('brightness', value));
};

exports.getMaxBrightness = () => {
    return readValue('max_brightness').then((maxBrightnessValue) => parseInt(maxBrightnessValue, 10));
};
