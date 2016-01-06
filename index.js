var Service, Characteristic;
var request = require("request");
var pollingtoevent = require('polling-to-event');

module.exports = function(homebridge){
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-http-advanced", "Http-advanced", HttpAdvancedAccessory);
}


function HttpAdvancedAccessory(log, config) {
  this.log = log;

 	// url info
	this.on_url                 = config["on_url"];
	this.on_body                = config["on_body"];
	this.off_url                = config["off_url"];
	this.off_body               = config["off_body"];
	this.lock_url               = config["lock_url"]; 
	this.lock_body              = config["lock_body"];
	this.unlock_url             = config["unlock_url"]  			|| this.lock_url;
	this.unlock_body            = config["unlock_body"] 			|| this.lock_body;
	this.status_url             = config["status_url"];
	this.brightness_url         = config["brightness_url"];
	this.brightnesslvl_url      = config["brightnesslvl_url"];
	this.http_method            = config["http_method"] 	  	 	|| "GET";
	this.http_brightness_method = config["http_brightness_method"] 	|| this.http_method;
	this.http_lock_method       = config["http_lock_method"] 	 	|| this.http_method;
	this.username               = config["username"] 	  	 	 	|| "";
	this.password               = config["password"] 	  	 	 	|| "";
	this.sendimmediately        = config["sendimmediately"] 	 	|| "";
	this.service                = config["service"] 	  	 	 	|| "Switch";
	this.name                   = config["name"];
	this.brightnessHandling     = config["brightnessHandling"] 	 	|| "no";
	this.switchHandling 	    = config["switchHandling"] 		 	|| "no";

	this.state = false;

    	var that = this;

	var emitter = pollingtoevent(function(done) {
        	that.httpRequest(that.status_url, "", "GET", that.username, that.password, that.sendimmediately, function(error, response, responseBody) {
            		if (error) {
                		that.log('HTTP get power function failed: %s', error.message);
		                callback(error);
            		} else {               				    
		                done(null, responseBody);
            		}
        	})
    	}, {longpolling:true,interval:3000});

	emitter.on("longpoll", function(data) {       
        	var binaryState = parseInt(data);
	        that.state = binaryState > 0;
		that.log(that.service, "received data from url:"+that.status_url, "state is currently", binaryState); 

	switch (that.service) {
		case "Switch":
			if (that.switchService ) {
				that.switchService .getCharacteristic(Characteristic.On)
				.setValue(that.state);
			}
			break;
		case "Light":
			if (that.lightbulbService) {
				that.lightbulbService.getCharacteristic(Characteristic.On)
				.setValue(that.state);
			}		
			break;
		case "Smoke":
			if (that.smokeService) {
				that.smokeService.getCharacteristic(Characteristic.SmokeDetected)
				.setValue(that.state);
			}
			break;
		case "Motion":
			if (that.motionService) {
				that.motionService.getCharacteristic(Characteristic.MotionDetected)
				.setValue(that.state);
			}		
			break;
		}        
    });


}

HttpAdvancedAccessory.prototype = {

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
  

	getLockCurrentState: function(callback){
		this.log("getLockCurrentState");
		callback(null, 1); //Not possible with my setup
	},
	setLockCurrentState: function(callback){
		this.log("setLockCurrentState");
		callback(null, 1); //Not possible with my setup
	},
	getLockTargetState: function(callback){
		this.log("getLockTargetState");
		callback(null, 1); //Not possible with my setup
	},

	setLockTargetState: function(powerOn,callback) {
		var url;
		var body;

		if (!this.unlock_url || !this.lock_url) {
			this.log.warn("Ignoring request; No Door url defined.");
			callback(new Error("No Door url defined."));
		    return;
		}

	    if (powerOn) {
	      url = this.lock_url;
	      body = this.lock_body;
	      this.log("Locking Door");
	    } else {
      		url = this.unlock_url;
            body = this.unlock_body;
      		this.log("Unlocking Door");
	    }
		this.httpRequest(url, body, this.http_method, this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
			if (error) {
				this.log('HTTP Door function failed: %s', error.message);
				callback(error);
			} else {
				this.log('HTTP Door function succeeded!');
				callback();
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
	var that = this;	
    // you can OPTIONALLY create an information service if you wish to override
    // the default values for things like serial number, model, etc.
    var informationService = new Service.AccessoryInformation();

    informationService
    .setCharacteristic(Characteristic.Manufacturer, "HTTP Manufacturer")
    .setCharacteristic(Characteristic.Model, "HTTP Model")
    .setCharacteristic(Characteristic.SerialNumber, "HTTP Serial Number");

	switch (this.service) {
	case "Switch":
		

		if (this.switchHandling == "yes") {
			this.switchService = new Service.Switch(this.name);			
			this.switchService

			.getCharacteristic(Characteristic.On)
			.on('get', function(callback) {callback(null, that.state)})
			.on('set', this.setPowerState.bind(this));
			return [this.switchService];
			break;
		} else {
			var switchService = new Service.Switch(this.name);
			switchService
			.getCharacteristic(Characteristic.On)	
			.on('set', this.setPowerState.bind(this));
		     	return [switchService];
		}
        	break;
	case "Light":
		var lightbulbService = new Service.Lightbulb(this.name);

		if (this.switchHandling == "yes") {
			lightbulbService
			.getCharacteristic(Characteristic.On)
			.on('get', this.getStatusState.bind(this))
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
		break;
	case "Door":
		var lockService = new Service.LockMechanism(this.name);
 
		lockService 
		.getCharacteristic(Characteristic.LockCurrentState)
		.on('get', this.getLockCurrentState.bind(this))
		.on('set', this.setLockCurrentState.bind(this));

		lockService 
		.getCharacteristic(Characteristic.LockTargetState)
		.on('get', this.getLockTargetState.bind(this))
		.on('set', this.setLockTargetState.bind(this));

	     	return [lockService];
		break;
	case "Smoke":
		this.smokeService = new Service.MotionSensor(this.name);
	        
		this.smokeService
		.getCharacteristic(Characteristic.SmokeDetected)
		.on('get', function(callback) {callback(null, that.state)});

		return [this.smokeService];
	case "Motion":
		this.motionService = new Service.MotionSensor(this.name);
	        
		this.motionService
		.getCharacteristic(Characteristic.MotionDetected)
		.on('get', function(callback) {callback(null, that.state)});

	        return [this.motionService];
        	break;
	}
  }
};
