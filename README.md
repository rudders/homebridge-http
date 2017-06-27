# Seeking New Maintainers

As I have commitments that don't allow me to progress this module I'm actively seeking contributors to this repo to maintain it. 

Please let me know if you're interested.

# homebridge-http

Supports https devices on the HomeBridge Platform and provides a readable callback for getting the "On" and brightness level characteristics to Homekit.

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install homebridge-http using: npm install -g homebridge-http
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

This module has recently been updated to support an additional method to read the power state of the device and the brightness level. Specify the `status_url` in your config.json that returns the status of the device as an integer (0 = off, 1 = on). 

In the latest version you can use custom status responses beyond 0 and 1

For example include these in config.json, these work with motion, exchange for what you get from your status url.
"status_on": "ACTIVE",
"status_off": "PAUSE",

On and off statuses also support JSON responses. If you need a more complex way to tell if your accessory is in an on state have it send a JSON object back that matches what you specify in the config file.
Example:
```
"status_on": {
    "speaker": "ON",
    "playlist": "Top Hits",
    "playmode": "PLAY"
}
```
Note that the response can contain more properties than what is specified, if all of the properties in the config object have matching properties in the response than it will be considered a match.

Specify the `brightnesslvl_url` to return the current brightness level as an integer.

Switch Handling and brightness Handling support 3 methods, yes for polling on app load, realtime for constant polling or no polling

Configuration sample:

 ```
"accessories": [
    {
		"accessory": "Http",
		"name": "Alfresco Lamp",
		"switchHandling": "realtime",
		"http_method": "GET",
		"on_url":      "http://localhost/controller/1700/ON",
		"off_url":     "http://localhost/controller/1700/OFF",
		"status_url":  "http://localhost/status/100059",
		"status_on": "ON",
		"status_off": "OFF",
		"service": "Light",
		"brightnessHandling": "yes",
		"brightness_url":     "http://localhost/controller/1707/%b",
		"brightnesslvl_url":  "http://localhost/status/100054",
		"sendimmediately": "",
		"username" : "",
		"password" : ""					    
    },
    {
        "accessory": "Http",
        "name": "Color Changing Lamp",
        "switchHandling": "realtime",
        "http_method": "GET",
        "on_url": "http://localhost/controller/1700/ON",
        "off_url": "http://localhost/controller/1700/OFF",
        "status_url": "http://localhost/status/100059",
        "status_on": {
            "power": "ON",
            "color": "Blue"
        },
        "status_off": {
            "power": "OFF"
        },
        "service": "Light",
        "brightnessHandling": "yes",
        "brightness_url": "http://localhost/controller/1707/%b",
        "brightnesslvl_url": "http://localhost/status/100054",
        "sendimmediately": "",
        "username" : "",
        "password" : ""
    }
]
```

# ToDo

Complete documentation and review a number of  forks
