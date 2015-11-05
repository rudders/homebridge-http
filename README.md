# homebridge-http

Supports https devices on HomeBridge Platform

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-http
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

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
            "http_method": "POST",
			"service": "Switch",
			"brightnessHandling": "no"
        }
    ]

```