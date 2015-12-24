# homebridge-httpstatus

Supports https devices on the HomeBridge Platform and provides a readable callback for getting the "On" and brightness level characteristics to Homekit.

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin by cloning this repo.
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

The configuration for this plugin is the same as [homebridge-http](https://github.com/rudders/homebridge-http) but includes an additional method to read the power state of the device and the brightness level. Specify the `status_url` in your config.json that returns the status of the device as an integer (0 = off, 1 = on). Specify the `brightnesslvl_url` to return the current brighness level as an integer.

Configuration sample:

 ```
"accessories": [
    {
	"accessory": "HttpStatus",
	"name": "Kitchen Lamp",
	"on_url": "https://192.168.1.22:3030/devices/23222/on",
	"on_body": "{\"state\":\"On\"}",
	"off_url": "https://192.168.1.22:3030/devices/23222/off",
	"off_body": "{\"state\":\"Off\"}",
	"status_url": "https://192.168.1.22:3030/devices/23222/status",
	"brightness_url": "https://192.168.1.22:3030/devices/23222/brightness/%b",
	"brightnesslvl": "https://192.168.1.22:3030/devices/23222/brightnesslvl",
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
