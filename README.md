# rpi-backlight
A node library to control the backlight of the [official Raspberry Pi 7" touch display](https://www.raspberrypi.org/products/raspberry-pi-touch-display/)

## Installation

```bash
npm install --save rpi-backlight
```

## Usage

```javascript
var backlight = require('rpi-backlight');

// All methods return promises.

backlight.powerOn();
backlight.powerOff();
backlight.isPoweredOn();
backlight.getBrightness();
backlight.setBrightness(value); // The screen goes Off at <= 9 brightness value
backlight.getMaxBrightness();
```

## Coming soon

- [Brightness control](https://github.com/pimterry/rpi-backlight/issues/3)
- [Power status querying](https://github.com/pimterry/rpi-backlight/issues/1)
- [Idiot-proofing](https://github.com/pimterry/rpi-backlight/issues/2)
- ...[your feature here](https://github.com/pimterry/rpi-backlight/issues/new)?