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
		"name": "Alfresco Lamp",
		"switchHandling": "yes",
				"http_method": "GET",
				"on_url":      "http://localhost/controller/1700/ON",
				"off_url":     "http://localhost/controller/1700/OFF",
				"status_url":  "http://localhost/status/100059",
		"service": "Light",
				"brightnessHandling": "yes",
				"brightness_url":     "http://localhost/controller/1707/%b",
				"brightnesslvl_url":  "http://localhost/status/100054"			
									    
       } 
    ]
```
