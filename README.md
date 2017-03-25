# rpi-backlight
A node library to control the backlight of the [official Raspberry Pi 7" touch display](https://www.raspberrypi.org/products/raspberry-pi-touch-display/)

## Installing

```bash
npm install --save rpi-backlight
```

## Usage

```javascript
var backlight = require('rpi-backlight');

// All methods return promises.

backlight.powerOn();
backlight.powerOff();
```