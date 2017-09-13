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
      if (err !== null){
        reject(err); 
      } else {
        resolve(data);
      }
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

exports.getActualPowerValue = () => {
  return readValue('bl_power');
};

/** Brightness managment */
exports.setMaxBrightness = () => {
  return writeValue('brightness', '255');
};

exports.setBrightnessValue = (value) => {
  return writeValue('brightness', value);
};

/** Not working */
exports.goToBrightnessValue = (toValue, speed) => {
  let from = this.getActualBrightness();
  from.then((data) => {
      if (toValue < data) {
        while (toValue < data) {
          setTimeout(() => {
            writeValue('brightness', data--);
          }, speed);
        }
      } else if (toValue > data) {
        while (toValue > data) {
          setTimeout(() => {
            writeValue('brightness', data++);
          }, speed);
        }
      }
  }); 
  
  return "OK";
};

exports.getActualBrightness = () => {
  return readValue('actual_brightness');
};