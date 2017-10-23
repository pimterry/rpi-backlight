const express = require('express');
const app = express();
const backlight = require('rpi-backlight');

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

app.get('/isScreenOn', (req, res) => {
    backlight.isPoweredOn().then((isScreenOn) => {
        if (isScreenOn)
            res.send('Screen is ON <br><a href="/">Back to home page</a>');
        else
            res.send('Screen is OFF <br><a href="/">Back to home page</a>');
    });
});

app.get('/getBrightness', (req, res) => {
    backlight.getBrightness().then((brightnessValue) => {
        res.send('Screen brightness: ' + brightnessValue + '%<br><a href="/">Back to home page</a>');
    });    
});

// The screen goes Off at <= 3% brightness value
app.get('/setBrightness/:value/:duration?', (req, res) => {
    let speed = req.params.duration ? req.params.duration : 0;
    backlight.setBrightness(req.params.value, speed).then(() => {
        return backlight.getBrightness();
    }).then((newBrightnessValue) => {
        if (speed == 0) {
            res.send('Screen brightness is now: ' + newBrightnessValue + '%<br><a href="/">Back to home page</a>');
        } else {
            res.send('Screen brightness is going to: ' + req.params.value + '%<br><a href="/">Back to home page</a>');
        }        
    }).catch((err) => {
        if (req.params.value > 100) {
            res.send('ERR: Max value is 100% <br><a href="/">Back to home page</a>');
        } else if (req.params.value < 0) {
            res.send('ERR: Min value is 0% <br><a href="/">Back to home page</a>');
        }
    });
});

/** Server */
app.listen(3000, () => {
    console.log("server up on port: 3000 !");
}); 
