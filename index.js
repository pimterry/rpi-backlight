var path = require('path');
var fs = require('fs');

var backlightPath = '/sys/class/backlight/rpi_backlight';
var isSupported = fs.existsSync(backlightPath);

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

function assertSupport() {
    if (!isSupported) {
        throw new Error('Backlight control not supported (' + backlightPath + ' does not exist)');
    }
}

/** Support */
exports.isSupported = () => {
    return isSupported;
};

/** Power managment */
exports.powerOn = () => {
    assertSupport();
    return writeValue('bl_power', '0');
};

exports.powerOff = () => {
    assertSupport();
    return writeValue('bl_power', '1');
};

exports.isPoweredOn = () => {
    assertSupport();
    return readValue('bl_power').then((powerValue) => parseInt(powerValue, 10) === 0);
};

/** Brightness managment */
exports.getBrightness = () => {
    assertSupport();
    return readValue('actual_brightness').then((brightnessValue) => parseInt(brightnessValue, 10));
};

exports.setBrightness = (value) => {
    assertSupport();
    return this.getMaxBrightness().then((maxBrightnessValue) => writeValue('brightness', value));
};

exports.getMaxBrightness = () => {
    assertSupport();
    return readValue('max_brightness').then((maxBrightnessValue) => parseInt(maxBrightnessValue, 10));
};
