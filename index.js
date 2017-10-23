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

function getMaxBrightness () {
    return readValue('max_brightness').then((maxBrightnessValue) => parseInt(maxBrightnessValue, 10));
};

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
exports.getBrightness = (percentage = true) => {
    return  getMaxBrightness().then((maxBrightnessValue) => readValue('actual_brightness').then((brightnessValue) => {
        return percentage ? Math.round((parseInt(brightnessValue, 10) * 100) / maxBrightnessValue) : parseInt(brightnessValue, 10);
    }));
};

exports.setBrightness = (value, speed = 0) => {
    return getMaxBrightness().then((maxBrightnessValue) =>  {
        let toValue = Math.round((parseInt(value, 10) * maxBrightnessValue) / 100);
        speed = parseInt(speed, 10);    
        if (speed > 0 && toValue > 0) {
            return this.getBrightness(false).then((actualBrightnessValue) => {
                if (toValue < actualBrightnessValue) {
                    let goDown = setInterval(() => { 
                        if (actualBrightnessValue > toValue) {
                            writeValue('brightness', actualBrightnessValue--); 
                        } else {
                            clearInterval(goDown);
                        }                   
                    }, speed);
                } else if (toValue > actualBrightnessValue) {
                    let goUp = setInterval(() => {
                        if (actualBrightnessValue < toValue) {
                            writeValue('brightness', actualBrightnessValue++); 
                        } else {
                            clearInterval(goUp);
                        }                   
                    }, speed);
                }                
            });
        } else {
            return writeValue('brightness', toValue);
        }        
    });
};

