var Service, Characteristic;
var request = require("request");

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-httpstatus", "Http", HttpStatusAccessory);
}


function HttpStatusAccessory(log, config) {
  this.log = log;

  // url info
  this.on_url                 = config["on_url"];
  this.on_body                = config["on_body"];
  this.off_url                = config["off_url"];
  this.off_body               = config["off_body"];
  this.status_url             = config["status_url"];
  this.brightness_url         = config["brightness_url"];
  this.brightnesslvl_url      = config["brightnesslvl_url"];
  this.http_method            = config["http_method"] 	  	 || "GET";;
  this.http_brightness_method = config["http_brightness_method"] || this.http_method;
  this.username               = config["username"] 	  	 || "";
  this.password               = config["password"] 	  	 || "";
  this.sendimmediately        = config["sendimmediately"] 	 || "";
  this.service                = config["service"] 	  	 || "Switch";
  this.name                   = config["name"];
  this.brightnessHandling     = config["brightnessHandling"] 	 || "no";
  this.switchHandling = config["switchHandling"] 		 || "no";
}

HttpStatusAccessory.prototype = {

  httpRequest: function(url, body, method, username, password, sendimmediately, callback) {
    request({
      url: url,
      body: body,
      method: method,
      rejectUnauthorized: false,
      auth: {
        user: username,
        pass: password,
        sendImmediately: sendimmediately
      }
    },
    function(error, response, body) {
      callback(error, response, body)
    })
  },

  setPowerState: function(powerOn, callback) {
    var url;
    var body;

    if (!this.on_url || !this.off_url) {
    	    this.log.warn("Ignoring request; No power url defined.");
	    callback(new Error("No power url defined."));
	    return;
    }

    if (powerOn) {
      url = this.on_url;
      body = this.on_body;
      this.log("Setting power state to on");
    } else {
      url = this.off_url;
      body = this.off_body;
      this.log("Setting power state to off");
    }

    this.httpRequest(url, body, this.http_method, this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
      if (error) {
        this.log('HTTP set power function failed: %s', error.message);
        callback(error);
      } else {
        this.log('HTTP set power function succeeded!');
        callback();
      }
    }.bind(this));
  },
  
  getPowerState: function(callback) {
    if (!this.status_url) {
    	    this.log.warn("Ignoring request; No status url defined.");
	    callback(new Error("No status url defined."));
	    return;
    }
    
    var url = this.status_url;
    this.log("Getting power state");

    this.httpRequest(url, "", "GET", this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
      if (error) {
        this.log('HTTP get power function failed: %s', error.message);
        callback(error);
      } else {
        var binaryState = parseInt(responseBody);
        var powerOn = binaryState > 0;
        this.log("Power state is currently %s", binaryState);
        callback(null, powerOn);
      }
    }.bind(this));
  },

getBrightness: function(callback) {
	if (!this.brightnesslvl_url) {
    	    this.log.warn("Ignoring request; No brightness level url defined.");
	    callback(new Error("No brightness level url defined."));
	    return;
	 }		
		var url = this.brightnesslvl_url;
		this.log("Getting Brightness level");

		this.httpRequest(url, "", "GET", this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
		  if (error) {
			this.log('HTTP get brightness function failed: %s', error.message);
			callback(error);
		  } else {			
		    var binaryState = parseInt(responseBody);
			var level = binaryState;
			this.log("brightness state is currently %s", binaryState);
			callback(null, level);
		  }
		}.bind(this));
	  },

  setBrightness: function(level, callback) {
	
	if (!this.brightness_url) {
    	    this.log.warn("Ignoring request; No brightness url defined.");
	    callback(new Error("No brightness url defined."));
	    return;
	 }    

    var url = this.brightness_url.replace("%b", level)

    this.log("Setting brightness to %s", level);

    this.httpRequest(url, "", this.http_brightness_method, this.username, this.password, this.sendimmediately, function(error, response, body) {
      if (error) {
        this.log('HTTP brightness function failed: %s', error);
        callback(error);
      } else {
        this.log('HTTP brightness function succeeded!');
        callback();
      }
    }.bind(this));
  },

  identify: function(callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getServices: function() {

    // you can OPTIONALLY create an information service if you wish to override
    // the default values for things like serial number, model, etc.
    var informationService = new Service.AccessoryInformation();

    informationService
    .setCharacteristic(Characteristic.Manufacturer, "HTTP Manufacturer")
    .setCharacteristic(Characteristic.Model, "HTTP Model")
    .setCharacteristic(Characteristic.SerialNumber, "HTTP Serial Number");

    if (this.service == "Switch") {
      var switchService = new Service.Switch(this.name);

      if (this.switchHandling == "yes") {
			switchService
			.getCharacteristic(Characteristic.On)
			.on('get', this.getPowerState.bind(this))
			.on('set', this.setPowerState.bind(this));
		  } else {
			switchService
			.getCharacteristic(Characteristic.On)	
			.on('set', this.setPowerState.bind(this));
		  }
      return [switchService];
    } else if (this.service == "Light") {
      var lightbulbService = new Service.Lightbulb(this.name);

	if (this.switchHandling == "yes") {
			lightbulbService
			.getCharacteristic(Characteristic.On)
			.on('get', this.getPowerState.bind(this))
			.on('set', this.setPowerState.bind(this));
		  } else {
			lightbulbService
			.getCharacteristic(Characteristic.On)	
			.on('set', this.setPowerState.bind(this));
		  }

      if (this.brightnessHandling == "yes") {

        lightbulbService
        .addCharacteristic(new Characteristic.Brightness())
        .on('get', this.getBrightness.bind(this))
        .on('set', this.setBrightness.bind(this));
      }

      return [informationService, lightbulbService];
    }
  }
};