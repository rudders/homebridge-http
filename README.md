# homebridge-readablehttp

Supports https devices on the HomeBridge Platform and provides a readable callback for getting the "On" characteristic to Homekit.

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-readablehttp
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

The configuration for this plugin is the same as [homebridge-http](https://github.com/rudders/homebridge-http) but includes an additional method to read the power state of the device. Specify the `readable_url` in your config.js that returns the status of the device as an integer (0 = off, 1 = on).

Configuration sample:

 ```
"accessories": [
    {
	"accessory": "Http",
	"name": "Kitchen Lamp",
	"on_url": "https://192.168.1.22:3030/devices/23222/on",
	"on_body": "{\"state\":\"On\"}",
	"off_url": "https://192.168.1.22:3030/devices/23222/off",
	"off_body": "{\"state\":\"Off\"}",
	"readable_url": "https://192.168.1.22:3030/devices/23222/status",
	"brightness_url": "https://192.168.1.22:3030/devices/23222/brightness/%b",
	"username": "",
	"password": "",
	"sendimmediately": "",
	"http_method": "POST",
	"http_brightness_method": "POST",       
	"service": "Switch",
	"brightnessHandling": "no"
    }
]

```
