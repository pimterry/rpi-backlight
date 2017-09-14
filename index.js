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
  if (value > 255 || value < 0) {
    return "ERR: Incorrect value";
  }
  return writeValue('brightness', value);
};

exports.goToBrightnessValue = (toValue, speed) => {
  if (toValue > 255 || toValue < 0) {
    return "ERR: Incorrect value";
  }
  let from = this.getActualBrightness();
  from.then((data) => {
    if (toValue < data) {
      let goDown = setInterval(function(){ 
        if (data > toValue) {
          writeValue('brightness', data--); 
        } else {
          clearInterval(goDown);
        }                   
      }, speed);
    } else if (toValue > data) {
      let goUp = setInterval(function(){ 
        if (data < toValue) {
          writeValue('brightness', data++); 
        } else {
          clearInterval(goUp);
        }                   
      }, speed);
    }
  }); 
  
  return "OK";
};

exports.getActualBrightness = () => {
  return readValue('actual_brightness');
};