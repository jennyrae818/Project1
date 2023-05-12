// creating Welcome modal and zipmodal variable
var $modal = $('.modal');
var $zipModal = $('.zipModal');

// Array to store the markers
var markers = [];

// creating input variable and search button variable
var zipInput = document.querySelector('#zip');
var searchBtn = document.querySelector('#button1');

// will be used later to pull zip value
var getZip;

// variables for displaying zone results and creating appropriate link
var results = document.querySelector('.results');
var zoneLink = document.querySelector('#zoneLink');

// variable to store city name
var cityName = '';

getZip = localStorage.getItem('zip') || '98052';

// Defines the request for kroger stores
var requestFredMeyers = {
	location: coords,
	radius: '500', // Preferring results closer to the center point.
	query: 'krogers', 
};

var init = function () {
	$zipModal.hide();
	geocode({ address: getZip });
}

var createMarker = function (place) {
	if (!place.geometry || !place.geometry.location) return;

	const marker = new google.maps.Marker({
		map,
		position: place.geometry.location,
	});
	// open a pop-up window to display address.
	google.maps.event.addListener(marker, 'click', () => {
		const content = document.createElement('div');
		const nameElement = document.createElement('h2');
		const addressElement = document.createElement('p');

		nameElement.textContent = place.name;
		addressElement.textContent = place.formatted_address;

		content.appendChild(nameElement);
		content.appendChild(addressElement);
		infowindow.setContent(content);
		infowindow.open(map, marker);
	});
	markers.push(marker);
};

// search Kroger stores and create markers for them.
var getKrogerStores = function (requestLocation) {
	markers = [];
	console.log(markers);
	console.log(requestLocation);
	service.textSearch(requestLocation, (results, status) => {
		if (status === google.maps.places.PlacesServiceStatus.OK && results) {
			console.log(results.length);
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			}
		}
	});
}

var geocode = function (request) {
	clear();
	geocoder.geocode(request)
		.then((result) => {
			const { results } = result;

			map.setCenter(results[0].geometry.location);

			cityName = results[0].address_components[1].long_name;
			console.log(cityName);
			console.log(results[0].geometry.location.lat());
			requestFredMeyers.location.lat = results[0].geometry.location.lat();
			requestFredMeyers.location.lng = results[0].geometry.location.lng();
			console.log(requestFredMeyers.location.lat);
			getKrogerStores(requestFredMeyers);
		})
		.catch((e) => {
			alert('Geocode was not successful for the following reason: ' + e);
		});
}

// Sets the map on all markers in the array.
var setMapOnAll = function (map) {
	for (let i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

var clear = function () {
	setMapOnAll(null);
	markers = [];
}

// ZIPCODE INPUT
searchBtn.addEventListener('click', (event) => {
	event.preventDefault();
	getZip = zipInput.value.trim();
	if (getZip.length !== 5) {
		// zipModal displays if zipcode entry is !5 character
		$zipModal.dialog({
			modal: true,
			minWidth: 400,
		})
	} else {
		console.log(getZip);
		localStorage.setItem('zip', getZip);
		geocode({ address: getZip });
		if ($zipModal.css('visibility') === 'hidden') {
			$zipModal.css('visibility', 'visible');
		} else {
			$zipModal.css('visibility', 'hidden');
		}
	}
});

var show = function () {
	paraP = document.getElementById('hidden');
}


document.addEventListener('DOMContentLoaded', (e) => {
	init();
});