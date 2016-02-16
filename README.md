# homebridge-http

Supports https devices on the HomeBridge Platform and provides a readable callback for getting the "On" and brightness level characteristics to Homekit.

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install homebridge-http using: npm install -g homebridge-http
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

This module has recently been updated to support an additional method to read the power state of the device and the brightness level. Specify the `status_url` in your config.json that returns the status of the device as an integer (0 = off, 1 = on). 

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
		"service": "Light",
		"brightnessHandling": "yes",
		"brightness_url":     "http://localhost/controller/1707/%b",
		"brightnesslvl_url":  "http://localhost/status/100054",
		"sendimmediately": "",
		"username" : "",
		"password" : ""					    
       } 
    ]
```

#ToDo

Complete documentation and review a number of  forks