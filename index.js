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
    return new Promise((resolve, reject) => {
        readValue('bl_power').then((powerValue) => { 
            resolve(parseInt(powerValue) === 0 ? true : false);
        }); 
    });     
};

/** Brightness managment */
exports.getBrightness = () => {
    return new Promise((resolve, reject) => {
        readValue('actual_brightness').then((brightnessValue) => { 
            resolve(parseInt(brightnessValue));
        }); 
    });  
};

exports.setBrightness = (value) => {
    return new Promise((resolve, reject) => {
        this.getMaxBrightness().then((maxBrightnessValue) => { 
            if (value > maxBrightnessValue || value < 0) {
                return "ERR: Incorrect value";
            }
            return writeValue('brightness', value);
        }); 
    });       
};

exports.getMaxBrightness = () => {
    return new Promise((resolve, reject) => {
        readValue('max_brightness').then((maxBrightnessValue) => {
            resolve(parseInt(maxBrightnessValue));
        });  
    }); 
};

exports.setMaxBrightness = () => {    
    return new Promise((resolve, reject) => {
        this.getMaxBrightness().then((maxBrightnessValue) => {
            writeValue('brightness', maxBrightnessValue);
            resolve(maxBrightnessValue);
        });    
    }); 
};

