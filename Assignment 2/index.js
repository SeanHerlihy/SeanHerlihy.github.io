function decodeWeather(code) {
	const weatherCodeMap = {
		0: "Unknown",
		1000: "Clear",
		1001: "Cloudy",
		1100: "Mostly Clear",
		1101: "Partly Cloudy",
		1102: "Mostly Cloudy",
		2000: "Fog",
		2100: "Light Fog",
		3000: "Light Wind",
		3001: "Windy",
		3002: "Strong Wind",
		4000: "Drizzle",
		4001: "Rain",
		4200: "Light Rain",
		4201: "Heavy Rain",
		5000: "Snow",
		5001: "Flurries",
		5100: "Light Snow",
		5101: "Heavy Snow",
		6000: "Freezing Drizzle",
		6001: "Freezing Rain",
		6200: "Light Freezing Rain",
		6201: "Heavy Freezing Rain",
		7000: "Ice Pellets",
		7101: "Heavy Ice Pellets",
		7102: "Light Ice Pellets",
		8000: "Thunderstorm"
	};
	
	if (weatherCodeMap.hasOwnProperty(code)) {
        return weatherCodeMap[code];
    } else {
        return "Unknown Weather Code";
    }
}

function decodeWeatherImage(code) {
	const weatherCodeMap = {
		1000: "clear_day.svg",
		1001: "cloudy.svg",
		1100: "mostly_clear_day.svg",
		1101: "partly_cloudy_day.svg",
		1102: "mostly_cloudy.svg",
		2000: "fog.svg",
		2100: "fog_light.svg",
		3000: "light_wind.jpg",
		3001: "wind.png",
		3002: "strong-wind.png",
		4000: "drizzle.svg",
		4001: "rain.svg",
		4200: "rain_light.svg",
		4201: "rain_heavy.svg",
		5000: "snow.svg",
		5001: "flurries.svg",
		5100: "snow_light.svg",
		5101: "snow_heavy.svg",
		6000: "freezing_drizzle.svg",
		6001: "freezing_rain.svg",
		6200: "freezing_rain_light.svg",
		6201: "freezing_rain_heavy.svg",
		7000: "ice_pellets.svg",
		7101: "ice_pellets_light.svg",
		7102: "ice_pellets_heavy.svg",
		8000: "tstorm.svg"
	};
	
	if (weatherCodeMap.hasOwnProperty(code)) {
        return weatherCodeMap[code];
    } else {
        return "clear_day.svg";
    }
}

function updateData(data) {
	const intervals = data.data.timelines[0].intervals;
	var values = intervals[0].values;
	var date;
	const tempMax = [];
	const tempMin = [];
	const dates = [];
	
	document.getElementById("currWeatherImage").src = "lib/images/symbols/" + decodeWeatherImage(values.weatherCode);
	document.getElementById("currWeather").innerHTML = decodeWeather(values.weatherCode);
	document.getElementById("currTemp").innerHTML = (Math.round(values.temperature * 10) / 10) + "&deg;";
	document.getElementById("currHumidity").innerHTML = values.humidity;
	document.getElementById("currVis").innerHTML = values.visibility;
	document.getElementById("currWind").innerHTML = values.windSpeed;
	document.getElementById("currPressure").innerHTML = values.pressureSeaLevel;
	document.getElementById("currCC").innerHTML = values.cloudCover;
	document.getElementById("currUV").innerHTML = values.uvIndex;
	
	document.getElementById("todayInfo").style.display = "flex";
	document.getElementById("forecastTable").style.display = "flex";
	
	for (let i = 0; i <= intervals.length - 1; i++) {
		date = intervals[i].startTime;
		values = intervals[i].values;
		
		document.getElementById("rowDate" + i).innerHTML = new Date(date).toLocaleDateString(undefined, {weekday: 'long',year: 'numeric',month: 'long',day: 'numeric'});
		document.getElementById("rowImage" + i).src = "lib/images/symbols/" + decodeWeatherImage(values.weatherCode);
		document.getElementById("rowCode" + i).innerHTML = decodeWeather(values.weatherCode);
		document.getElementById("rowTempMax" + i).innerHTML = values.temperatureMax + "&deg;F";
		document.getElementById("rowTempMin" + i).innerHTML = values.temperatureMin + "&deg;F";;
		document.getElementById("rowWS" + i).innerHTML = values.windSpeed + " mph";
		
		tempMax.push(values.temperatureMax);
		tempMin.push(values.temperatureMin);
		dates.push(new Date(date).toLocaleDateString(undefined, {month: 'short',day: 'numeric'}));
	}
	
	var myJsonA = {};
	var myJsonB = {};
	var myJsonC = {};
	
	myJsonA["tempMax"] = tempMax;
	console.log(JSON.stringify(myJsonA));
	sessionStorage.setItem("tempMax", JSON.stringify(myJsonA));
	myJsonB["tempMin"] = tempMin;
	console.log(JSON.stringify(myJsonB));
	sessionStorage.setItem("tempMin", JSON.stringify(myJsonB));
	myJsonC["dates"] = dates;
	console.log(JSON.stringify(myJsonC));
	sessionStorage.setItem("dates", JSON.stringify(myJsonC));
}

function getWeatherData(loc) {
	
	const fields = [
		'temperature', 'windSpeed', 'humidity', 'uvIndex', 
		'visibility', 'cloudCover', 'pressureSeaLevel', 'temperatureMax', 
		'temperatureMin', 'weatherCode', 'precipitationType', 'precipitationProbability',
		'sunriseTime', 'sunsetTime'
	];
	
	const payload = {
		'loc': loc,
		'ts': '1d',
		'tz': 'America/Los_Angeles',
		'units': 'imperial',
		'fields': fields
	};
	
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "https://blue-moss-aba55b1b98a24b52a5e52c8fc595333c.azurewebsites.net/tomorrow", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				const data = JSON.parse(xhr.responseText);
				sessionStorage.setItem("data", JSON.stringify(data));
				updateData(data);
			}
		}
	};
	
	xhr.send(JSON.stringify(payload));
}

function submitButton() {
	document.getElementById("streetError").style.display = "none";
	document.getElementById("cityError").style.display = "none";
	document.getElementById("stateError").style.display = "none";
	sessionStorage.setItem("flag", "t");

	if(document.getElementById("checkbox").checked) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "https://blue-moss-aba55b1b98a24b52a5e52c8fc595333c.azurewebsites.net/ipinfo", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		
		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					const data = JSON.parse(xhr.responseText);
					const loc = data.loc;
					document.getElementById("location").innerHTML = data.city + ", " + data.region;
					getWeatherData(loc);
				}
			}
		};
		
		xhr.send();
	} else {
		const city = document.getElementById("city-in").value;
		const state = document.querySelector("#state-in").value;
		const street = document.getElementById("street-in").value;
		
		if(!street) {
			document.getElementById("streetError").style.display = "block";
			return;
		}else if(city=="") {
			document.getElementById("cityError").style.display = "block";
			return;
		}else if(!state) {
			document.getElementById("stateError").style.display = "block";
			return;
		}
		
		const address = street + " " + city + " " + state;

		const payload = {
			'address': address
		};
		
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "https://blue-moss-aba55b1b98a24b52a5e52c8fc595333c.azurewebsites.net/geocode", true);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					const data = JSON.parse(xhr.responseText);
					const location = data.results[0].geometry.location;
					const address = data.results[0].formatted_address;
					const loc = JSON.stringify(location.lat) + "," + JSON.stringify(location.lng);
					document.getElementById("location").innerHTML = address;
					getWeatherData(loc);
				}
			}
		};

        xhr.send(JSON.stringify(payload));
	}
}

function clearButton() {
	document.getElementById("city-in").value = "";
	document.getElementById("state-in").value = "";
	document.getElementById("street-in").value = "";
	document.getElementById("test").innerHTML = "";
	sessionStorage.setItem("flag", "t");
	document.getElementById("arrowButton").src = "lib/images/arrowDown.png";
	
	document.getElementById("todayInfo").style.display = "none";
	document.getElementById("forecastTable").style.display = "none";
	document.getElementById("noResponse").style.display = "none";
	document.getElementById("dailyWeatherDetails").style.display = "none";
	document.getElementById("weatherCharts").style.display = "none";
	document.getElementById("streetError").style.display = "none";
	document.getElementById("cityError").style.display = "none";
	document.getElementById("stateError").style.display = "none";
}

function rowClick(x) {
	const index = x.rowIndex - 1;
	document.getElementById("todayInfo").style.display = "none";
	document.getElementById("forecastTable").style.display = "none";
	
	const data = JSON.parse(sessionStorage.getItem("data"));
	const intervals = data.data.timelines[0].intervals;
	const values = intervals[index].values;
	const date = intervals[index].startTime;
	
	document.getElementById("dailyBoxDate").innerHTML = new Date(date).toLocaleDateString(undefined, {weekday: 'long',year: 'numeric',month: 'long',day: 'numeric'});
	document.getElementById("dailyBoxState").innerHTML = decodeWeather(values.weatherCode);
	document.getElementById("dailyBoxTemp").innerHTML = values.temperatureMax + "&deg;F/" + values.temperatureMin + "&deg;F";
	document.getElementById("dailyBoxImage").src = "lib/images/symbols/" + decodeWeatherImage(values.weatherCode);
	document.getElementById("dailyBoxType").innerHTML = values.precipitationType;
	document.getElementById("dailyBoxChance").innerHTML = values.precipitationProbability + "%";
	document.getElementById("dailyBoxWS").innerHTML = values.windSpeed + " mph";
	document.getElementById("dailyBoxHumidity").innerHTML = values.humidity + "%";
	document.getElementById("dailyBoxVis").innerHTML = values.visibility + " mi";
	document.getElementById("dailyBoxSRSS").innerHTML = new Date(values.sunriseTime).getHours() + ":00/" + new Date(values.sunsetTime).getHours() + ":00";
	
	document.getElementById("dailyWeatherDetails").style.display = "flex";
	document.getElementById("weatherCharts").style.display = "flex";
}

function chartsButton(){
	if(sessionStorage.getItem("flag") == "t") {
		sessionStorage.setItem("flag", "f");
		document.getElementById("arrowButton").src = "lib/images/arrowUp.png";
		document.getElementById("tableA").style.display = "flex";
		document.addEventListener('DOMContentLoaded', loadChart());
	} else {
		sessionStorage.setItem("flag", "t");
		document.getElementById("arrowButton").src = "lib/images/arrowDown.png";
		document.getElementById("tableA").style.display = "none";
	}
}

function getChartData() {
	const fields = [
		'temperature', 'windSpeed', 'humidity', 'uvIndex', 
		'visibility', 'cloudCover', 'pressureSeaLevel', 'temperatureMax', 
		'temperatureMin', 'weatherCode', 'precipitationType', 'precipitationProbability',
		'sunriseTime', 'sunsetTime'
	];
	
	const payload = {
		'loc': loc,
		'ts': '1h',
		'tz': 'America/Los_Angeles',
		'units': 'imperial',
		'fields': fields
	};
	
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "https://blue-moss-aba55b1b98a24b52a5e52c8fc595333c.azurewebsites.net/tomorrow", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				const data = JSON.parse(xhr.responseText);
				sessionStorage.setItem("data", JSON.stringify(data));
				updateData(data);
			}
		}
	};
}

function loadChart () {
	var tempA = JSON.parse(sessionStorage.getItem("dates"));
	var tempB = JSON.parse(sessionStorage.getItem("tempMin"));
	var tempC = JSON.parse(sessionStorage.getItem("tempMax"));
	
	const days = tempA["dates"];
	const minTemperatures = tempB["tempMin"];
	const maxTemperatures = tempC["tempMax"];

    Highcharts.chart('tableA', {
        chart: {
            type: 'line',
        },
        title: {
            text: 'Temperature Ranges (Min, Max)', 
        },
        xAxis: {
            categories: days,
            title: {
                text: 'Date', 
            },
        },
        yAxis: {
            title: {
                text: 'Temperature (°F)',
            },
            min: 32,
        },
        series: [{
            name: 'Min Temperature',
            data: minTemperatures,
            color: '#0071A1',
        }, {
            name: 'Max Temperature',
            data: maxTemperatures,
            color: '#FF5733',
        }],
        tooltip: {
            shared: true,
            crosshairs: true,
        },
    });
}