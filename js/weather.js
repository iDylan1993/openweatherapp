window.onload = function() {
    //Get the local ip info
	var ipUrl = "https://ipinfo.io/json";		
	// Here it sets the Openweathermap api.		
	var appid = "appid=532570fbcad2aef68b57ce3f22e8f968";
	var location = document.getElementById("location");	
	var currentDate = new Date();
	var dayNight = "day";	
	httpReqIpAsync(ipUrl);							
	function httpReqIpAsync(url, callback) {
		var httpReqIp = new XMLHttpRequest();
		httpReqIp.open("GET", url, true)
		httpReqIp.onreadystatechange = function() {
			// Here it get the city, country, latitude and longitude.
			if(httpReqIp.readyState == 4 && httpReqIp.status == 200) {
				var jsonIp = JSON.parse(httpReqIp.responseText)
				var city = jsonIp.city;
				var country = jsonIp.country;
				location.innerHTML = `${city}, ${country}`;
				var lat = jsonIp.loc.split(",")[0];
				var lon = jsonIp.loc.split(",")[1];
				var weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${appid}`;
				httpReqWeatherAsync(weatherApi);
			}
		}
		httpReqIp.send();				
	}
	
	function httpReqWeatherAsync(url, callback) {
		var httpReqWeather = new XMLHttpRequest();
		httpReqWeather.open("GET", url, true);
		httpReqWeather.onreadystatechange = function() {
			if(httpReqWeather.readyState == 4 && httpReqWeather.status == 200) {
				var jsonWeather = JSON.parse(httpReqWeather.responseText);
				var weatherDesc = jsonWeather.weather[0].description;
				var id = jsonWeather.weather[0].id;
				// Here it get temperature of the current location.
				var temperature = jsonWeather.main.temp;
				// Here it changes the temperature  to celsius.
				var tempcelsius = Math.round(temperature - 273 )
				// Here it get the percentage of humidity from Openweathermap.
				var humidity = jsonWeather.main.humidity;
				// Here it get the windspeed from Openweathermap.
				var windSpeed = jsonWeather.wind.speed; 
			    // Here it get and change the unix timestamp from Openweathermap to readable time for sunrise.
				var sunup = new Date(jsonWeather.sys.sunrise*1000);
                var sunuphour = sunup.getHours();
                var sunupminutes = "0" + sunup.getMinutes();
				var sunrise = '0'+ sunuphour + ':' + sunupminutes.substr(-2);
				// Here it get and change the unix timestamp from Openweathermap to readable time for sunset.
				var sundown = new Date(jsonWeather.sys.sunset*1000);
                var sundownhour = sundown.getHours();
                var sundownminutes = "0" + sundown.getMinutes();
				var sunset =  sundownhour + ':' + sundownminutes.substr(-2);
				var suncheck = jsonWeather.sys.sunset;
				var timeNow = Math.round(currentDate / 1000);
			    // Here it checks if its day or night time, for the icon.
				dayNight = (timeNow < suncheck) ? "day" : "night";
				var description = document.getElementById("description");
				description.innerHTML = `<i id="icon-desc" class="wi wi-owm-${dayNight}-${id}"></i><p>${weatherDesc}</p>`;
				var tempElement = document.getElementById("temperature");
				tempElement.innerHTML = `${tempcelsius}<i id="icon-thermometer" class="wi wi-thermometer"></i>`	;
				var sunriseElem = document.getElementById("sunrise");
				sunriseElem.innerHTML = `${sunrise}`;
				var sunsetElem = document.getElementById("sunset");
				sunsetElem.innerHTML = `${sunset}`;
				var humidityElem = document.getElementById("humidity");
				humidityElem.innerHTML = `${humidity}%`;
				var windElem = document.getElementById("wind");
				windElem.innerHTML = `${windSpeed} m/h`;
			}
		}
		httpReqWeather.send();
	}							
}