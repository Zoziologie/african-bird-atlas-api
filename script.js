//import location from './location.json'


var markersLayer, app
var now = new Date
const res = 5 / 60;

/* PREPARE FOR COOKIES*/
var later = new Date();
later.setTime(later.getTime() + (365 * 24 * 60 * 60 * 1000));
var expires = "expires=" + later.toUTCString();
cookies_input = ['base', 'regionType', 'regionCountry', 'regionPentad', 'regionGroup', 'regionQdgc', 'filterType', 'filterObserver', 'speciesCode', 'startdate', 'enddate', 'cardNo'];

function getCookieValue(a) {
	var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
	return b ? decodeURIComponent(b.pop()) : '';
}

function pentad2latlng(p) {
	lat0 = parseFloat(p.slice(0, 2)) + parseFloat(p.slice(2, 4) / 60)
	lng0 = parseFloat(p.slice(5, 7)) + parseFloat(p.slice(7, 10) / 60)
	if (p[4] == "_" | p[4] == "a") {
		lat0 = -lat0;
	}
	if (p[4] == "b" | p[4] == "a") {
		lng0 = -lng0;
	}
	return [lat0, lng0]
}

function latlng2pentad(lat, lng) {

	if (lat < 0 & lng > 0) {
		letter = '_'
	} else if (lat < 0 & lng < 0) {
		letter = 'a'
	} else if (lat > 0 & lng < 0) {
		letter = 'b'
	} else if (lat > 0 & lng > 0) {
		letter = 'c'
	}

	lat = Math.abs(lat + 0.0001);
	lng = Math.abs(lng + 0.0001);
	var latDeg = Math.floor(lat);
	var lngDeg = Math.floor(lng);
	var latSec = Math.floor((lat-latDeg)*60/5)*5
	var lngSec = Math.floor((lng-lngDeg)*60/5)*5
	var latstr = String(latDeg).padStart(2, '0') + String(latSec).padStart(2, '0')
	var lngstr = String(lngDeg).padStart(2, '0') + String(lngSec).padStart(2, '0')

	return latstr + letter + lngstr

}

window.onload = function () {

	Vue.component('v-select', VueSelect.VueSelect);

	Vue.component('l-map', window.Vue2Leaflet.LMap);
	Vue.component('l-tile-layer', window.Vue2Leaflet.LTileLayer)
	Vue.component('l-rectangle', window.Vue2Leaflet.LRectangle)
	Vue.component('l-marker', window.Vue2Leaflet.LMarker)
	Vue.component('l-geo-json', window.Vue2Leaflet.LGeoJson)


	app = new Vue({
		delimiters: ["((", "))"],
		el: '#ff',
		data: {
			base: 'R',
			regionType: 'country',
			regionCountry: 'kenya',
			regionPentad: '3355_1825',
			regionGroup: "GM_BL_Lwvl",
			regionQdgc: "SE3318CD",
			filterType: "all",
			filterObserver: "73,20001,10573",
			speciesCode: "",
			startdate: "2007-07-01", //now.toISOString().split('T')[0],
			enddate: "2025-01-01",
			cardNo: "3325_1825_000228_20180922",
			regionProvince: "",
			format: "json",
			first: "",
			groups: [{
				label: "Aberdare Range",
				code: "40147_AbrdrRng"
			}, {
				label: "Amboseli Landscape",
				code: "40147_AmbslLndscp"
			}, {
				label: "Arabuko-Sokoke Forest",
				code: "40147_Arbk-SkkFrst"
			}, {
				label: "Athi-Kaputiei Plains",
				code: "40147_Ath-KptPlns"
			}, {
				label: "Boni-Dodori Reserves",
				code: "40147_Bn-DrdRsrvs"
			}, {
				label: "Cherangani Hills",
				code: "40147_ChrngnHlls"
			}, {
				label: "Chyulu Hills",
				code: "40147_ChylHlls"
			}, {
				label: "Coast - North",
				code: "40147_NrthCst-KE"
			}, {
				label: "Coast - South",
				code: "40147_SthCst-KE"
			}, {
				label: "Dida-Galgalu Desert",
				code: "40147_Dd-GlglDsrt"
			}, {
				label: "Gwasi Hills",
				code: "40147_GwsHlls"
			}, {
				label: "Kakamega and Nandi Forests",
				code: "40147_KkmgndNndFrsts"
			}, {
				label: "Laikipia",
				code: "40147_Lkp"
			}, {
				label: "Lake Baringo",
				code: "40147_LkBrng"
			}, {
				label: "Lake Bogoria",
				code: "40147_LkBgr"
			}, {
				label: "Lake Elementaita",
				code: "40147_LkElmntt"
			}, {
				label: "Lake Magadi",
				code: "40147_LkMgd"
			}, {
				label: "Lake Naivasha",
				code: "40147_LkNvsh"
			}, {
				label: "Lake Nakuru",
				code: "40147_LkNkr"
			}, {
				label: "Lake Ol Bolossat",
				code: "40147_LkOlBlsst"
			}, {
				label: "Lake Turkana",
				code: "40147_LkTrkn"
			}, {
				label: "Lake Victoria",
				code: "40147_LkVctr"
			}, {
				label: "Loima Hills",
				code: "40147_LmHlls"
			}, {
				label: "Loita-Nguruman Hills",
				code: "40147_Lt-NgrmnHlls"
			}, {
				label: "Lorian Swamp",
				code: "40147_LrnSwmp"
			}, {
				label: "Masai Mara",
				code: "40147_GrtrMsMr"
			}, {
				label: "Matthews Range",
				code: "40147_MtthwsRng"
			}, {
				label: "Mau Forest Complex",
				code: "40147_MFrstCmplx"
			}, {
				label: "Meru-Kora-Rahole-Bisanadi Reserves",
				code: "40147_Mr-Kr-Rhl-BsndRsrvs"
			}, {
				label: "Mount Elgon",
				code: "40147_MntElgn-KE"
			}, {
				label: "Mount Kenya",
				code: "40147_MntKny"
			}, {
				label: "Mount Kulal",
				code: "40147_MntKll"
			}, {
				label: "Mount Marsabit",
				code: "40147_MntMrsbt"
			}, {
				label: "Mount Nyiru",
				code: "40147_MntNyr"
			}, {
				label: "Mount Suswa",
				code: "40147_MntSsw"
			}, {
				label: "Nairobi",
				code: "40147_Nrb"
			}, {
				label: "Ndoto Mountains",
				code: "40147_NdtMntns"
			}, {
				label: "Ngong Hills",
				code: "40147_NgngHlls"
			}, {
				label: "North-Eastern",
				code: "40147_Nrth-Estrn"
			}, {
				label: "Nyambene Hills",
				code: "40147_NymbnHlls"
			}, {
				label: "Sekerr Range (Mtelo)",
				code: "40147_SkrrRng(Mtl)"
			}, {
				label: "Shimba Hills",
				code: "40147_ShmbHlls"
			}, {
				label: "Tana River Delta",
				code: "40147_TnRvrDlt"
			}, {
				label: "Tana River Mid Section",
				code: "40147_TnRvrMddlSctn"
			}, {
				label: "Tsavo Parks",
				code: "40147_TsvEstndWst"
			}, {
				label: "Turkwel River",
				code: "40147_TrkwlRvr"
			}],
			regions: ['country', 'pentad', 'province', 'group', 'qdgc'],
			regions_opt: ['all', 'country', 'pentad', 'province', 'group', 'qdgc'],
			countries: ['kenya', 'southafrica', 'nigeria', 'botswana', 'namibia', 'zimbabwe', 'lesotho', 'swaziland', 'mozambique'],
			structure: {},
			species: [],
			lurl: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFmbnVzcyIsImEiOiIzMVE1dnc0In0.3FNMKIlQ_afYktqki-6m0g', //'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			bounds: L.latLngBounds([
				[5.061499, 33.106787],
				[-5.316542, 42.232546]
			]),
			buttonDisplayMarkerPentad: false,
			marker_pentad: {
				position: {
					lat: -1.219482,
					lng: 38.953153
				},
			},
			geojson: {
				"type": "FeatureCollection",
				"features": []
			}
		},
		mounted() {
			var self = this;
			$.getJSON('structure.json',
				function (json) {
					self.structure = json;
				})
			$.getJSON('species.json',
				function (json) {
					self.species = json.map(l => {
						return {
							code: l[0],
							label: l[1]
						}
					});
				})
			/*cookies_input.forEach(function(s){
				var v = getCookieValue(s);
				if (!(v === "")){
					self[s] = v
				}
			})*/
		},
		computed: {
			displayMarkerPentad : function(){ return this.buttonDisplayMarkerPentad && this.regionType=="pentad" },
			rectangle_pentad: function () {
				var lng = this.marker_pentad.position.lng;
				var lat = this.marker_pentad.position.lat;

				this.regionPentad = latlng2pentad(lat, lng)

				var lat0 = Math.floor((lat + 0.000001) / res) * res
				var lng0 = Math.floor((lng + 0.000001) / res) * res
				return [
					[lat0, lng0],
					[lat0 + res, lng0 + res]
				]
			},
			base_opts: function () {
				return Object.keys(this.structure)
			},
			clayer: function () {
				if (Object.keys(this.structure).length == 0) {
					return []
				} else {
					var tmp = this.structure[this.base];
					return (typeof tmp == 'undefined') ? [] : tmp
				}
			}
		},
		methods: {
			url: function () {
				var url = ""
				jQuery('#url-group').children().each(function () {
					if (jQuery(this).hasClass('url-val')) {
						if (jQuery(this).val() == "all") {
							url = url.slice(0, url.length - 1);
						} else {
							url += String(jQuery(this).val()).replace('null', '')
						}
					} else if (jQuery(this).hasClass('url-species')) {
						url += Array.isArray(app.speciesCode) ? app.speciesCode.join(',') : app.speciesCode

					} else if (jQuery(this).hasClass('url-innertext')) {
						url += this.innerText
					}
				})
				return url.replace(/ /g, '').replace(/\r?\n|\r/g, '').replace('null').replace(/\/$/, "")
				/*cookies_input.forEach(function(s){
					document.cookie= s + "=" + encodeURIComponent(app[s]) + ";" + expires + ";path=/";
				})*/
			},
			exportURL: function (type, e) {
				console.log(app.url())
				if (type == "toJSON") {
					window.open(app.url() + '?format=JSON');
				} else if (type == 'toCSV') {
					window.open(app.url() + '?format=CSV');
				} else if (type == 'togeoJSON') {
					window.open(app.url() + '?format=geoJSON');
				}
			},
			exportMap: function (e) {
				console.log(app.url())
				jQuery(e.target).html('<i class="fa fa-spinner fa-spin"></i> Loading')
				jQuery.getJSON(app.url() + '?format=geoJSON', function (data) {

						if (data.type == "FeatureCollection") {
							app.geojson = data
						} else if (data.meta.call.includes("cards/species/0/")) {
							app.geojson = {
								"type": "FeatureCollection",
								"features": data.data.cards.reduce((acc, c) => {

									var id = acc.map(a => a.properties.pentad).indexOf(c.Pentad)

									pp = {
										CardNo: c.CardNo,
										StartDate: c.StartDate,
										ObserverNo: c.ObserverNo,
										TotalHours: c.TotalHours,
										TotalSpp: c.TotalSpp,
										Common_name: c.records[0].Common_species + ' ' + c.records[0].Common_group,
										Scientific_name: c.records[0].Genus + ' ' + c.records[0].Species,
										Sequence: c.records[0].Sequence
									}

									if (id != -1) {
										acc[id].properties.card.push(pp)
									} else {
										latlng = pentad2latlng(c.Pentad)
										console.log(latlng)
										acc.push({
											"type": "Feature",
											"properties": {
												"pentad": c.Pentad,
												"name": c.Pentad,
												"popupContent": c.Pentad,
												"card": [
													pp
												]
											},
											"geometry": {
												"type": "Polygon",
												"coordinates": [
													[
														[latlng[1], latlng[0]],
														[latlng[1], latlng[0] + res],
														[latlng[1] + res, latlng[0] + res],
														[latlng[1] + res, latlng[0]],
														[latlng[1], latlng[0]]
													]
												]
											}
										})
									}
									return acc
								}, [])
							}
						} else if (data.meta.call.includes("card/full/0/")) {
							app.geojson = {
								"type": "FeatureCollection",
								"features": data.data.cards.reduce((acc, c) => {

									var id = acc.map(a => a.properties.pentad).indexOf(c.Pentad)

									pp = {
										CardNo: c.CardNo,
										StartDate: c.StartDate,
										ObserverNo: c.ObserverNo,
										TotalHours: c.TotalHours,
										TotalSpp: c.TotalSpp,
										Common_name: c.records.map(r => r.Common_species + ' ' + r.Common_group).join(', ')
									}

									if (id != -1) {
										acc[id].properties.card.push(pp)
									} else {
										latlng = pentad2latlng(c.Pentad)
										console.log(latlng)
										acc.push({
											"type": "Feature",
											"properties": {
												"pentad": c.Pentad,
												"card": [
													pp
												]
											},
											"geometry": {
												"type": "Polygon",
												"coordinates": [
													[
														[latlng[1], latlng[0]],
														[latlng[1], latlng[0] + res],
														[latlng[1] + res, latlng[0] + res],
														[latlng[1] + res, latlng[0]],
														[latlng[1], latlng[0]]
													]
												]
											}
										})
									}
									return acc
								}, [])
							}
						}

						jQuery(e.target).html('<i class="fas fa-globe"></i> Map')

					})
					.fail(function (jqxhr, textStatus, error) {
						jQuery(e.target).html('<i class="fas fa-globe"></i> Map')
						var err = textStatus + ", " + error;
						alert("Request Failed: " + err + '<br>Check that the url is valid and that the key is added.');
					});
			}
		}
	})


}