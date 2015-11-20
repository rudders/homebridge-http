# homebridge-http

Supports https devices on HomeBridge Platform

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-http
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

if your http method for brightness is different to switching then add "http_brightness_method" to your config to set this - it will default to http_method if not present.

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