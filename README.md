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
// 1 = Screen is OFF
// 0 = Screen is ON
backlight.getActualPowerValue();

backlight.setMaxBrightness();
backlight.getActualBrightness();
// The screen goes Off at <= 9 brightness value
backlight.setBrightnessValue(value);

// Work in progress
backlight.goToBrightnessValue(toValue, speed);

```

## Forked from

- [pimterry/rpi-backlight](https://github.com/pimterry/rpi-backlight)

## Example of a simple app

index.js:
```javascript
const express = require('express');
const app = express();
const backlight = require('./rpi-backlight/index');

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname })
});

app.get('/screenOn', (req, res) => {
    backlight.powerOn();
    res.send('Screen On' + '<br><a href="/">Back to home page</a>');
});

app.get('/screenOff', (req, res) => {
    backlight.powerOff();
    res.send('Screen OFF' + '<br><a href="/">Back to home page</a>');
});

// 1 = Screen is OFF
// 0 = Screen is ON
app.get('/getPowerValue', (req, res) => {
    let promise = backlight.getActualPowerValue();
    promise.then((data) => {
        res.send('Screen state: ' + data + '<br><a href="/">Back to home page</a>');
    });    
});

// The screen get Off at < 10 brightness value
app.get('/setBrightness/:value', (req, res) => {
    if (req.params.value > 255) {
        res.send('ERR: Max value is 255' + '<br><a href="/">Back to home page</a>');
    } else if (req.params.value < 0) {
        res.send('ERR: Min value is 0' + '<br><a href="/">Back to home page</a>');
    } else {
        backlight.setBrightnessValue(req.params.value);
        res.send('Screen brightness is now: ' + req.params.value + '<br><a href="/">Back to home page</a>');
    }
});

app.get('/goToBrightnessValue/:toValue/:speed', (req, res) => {
    res.send('Screen brightness: ' + backlight.goToBrightnessValue(req.params.toValue, req.params.speed) + '<br><a href="/">Back to home page</a>'); 
});

app.get('/setMaxBrightness', (req, res) => {
    backlight.setMaxBrightness();
    res.send('Brightness setted to value 255' + '<br><a href="/">Back to home page</a>');
});

app.get('/getBrightnessValue', (req, res) => {
    let promise = backlight.getActualBrightness();
    promise.then((data) => {
        res.send('Screen brightness: ' + data + '<br><a href="/">Back to home page</a>');
    });    
});

/** Server */
app.listen(3000, () => {
    console.log("server up on port: 3000 !");
}); 

```

index.js:
```html
<!DOCTYPE html>
<html >
    <head>
    </head>
    <body>
        <h1>Let's try this !</h1>
        <ul>
            <li><a href="/screenOn">Screen On</a></li>
            <li><a href="/screenOff">Screen Off</a></li>
            <li><a href="/getPowerValue">Get screen state</a></li>
            <li><a href="/setBrightness/50">Set Brigthness value to 50</a></li>
            <li><a href="/goToBrightnessValue/15/20">Go to Brightness value to 15 with speed 20</a></li>
            <li><a href="/setMaxBrightness">Set Max Brightness</a></li>
            <li><a href="/getBrightnessValue">Get actual Brightness</a></li>
        </ul>
        <br><br>
        <h1><a href="" target="__blank">More informations on GitHub!</a></h1>
    </body>
</html>
```