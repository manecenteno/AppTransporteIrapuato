let accessToken =
    "pk.eyJ1Ijoiam9zZWNlbnRlbm8iLCJhIjoiY2w5amFqZDlvMHl4YTN1bXdsdXBsazJtbSJ9.3f_ovTAT3lT283h5IJhaGw";

//Layer base del mapa
let osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
        'Datos &copy; <a href="http://osm.org/copyright" target="blanck">Colaboradores de OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright" target="blanck">ODbL</a>) | Teselas <a href="https://github.com/gravitystorm/openstreetmap-carto" target="blanck">OSM Carto</a> &copy; Randy Allan y otros colaboradores (<a href="https://creativecommons.org/licenses/by-sa/2.0/deed.es" target="blanck">CC BY-SA 2.0</a>)',
});

//Creacion del mapa
let map = L.map("map", {
    center: [20.67586, -101.34295],
    zoom: 14,
    layers: [osm],
    minZoom: 12
});

function crearIcono(dir) {
    return L.icon({
        iconUrl: dir,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    })
}

function crearCapa(coordenadas, color, iconoInicio, iconoFin, popUpInicio, popUpFin, datosParadas, iconoParadas) {
    let trayecto = L.polyline(coordenadas, { color: color });
    let marcadorInicio = L.marker(coordenadas[0], { icon: iconoInicio }).bindPopup(popUpInicio);
    let marcadorFin = L.marker(coordenadas[coordenadas.length - 1], { icon: iconoFin }).bindPopup(popUpFin);

    if (datosParadas.length > 0) {
        let paradasBus = new L.markerClusterGroup();
        datosParadas.map((punto) => {
            L.marker([punto[0], punto[1]], { icon: iconoParadas }).addTo(paradasBus)
        })
        return L.layerGroup([trayecto, marcadorInicio, marcadorFin, paradasBus]);
    }
    return L.layerGroup([trayecto, marcadorInicio, marcadorFin]);
}

function crearGeocoder(placeholder) {
    return new MapboxGeocoder({
        accessToken: accessToken,
        marker: false,
        placeholder: placeholder,
        language: "es",
        countries: "mx",
        region: 'Guanajuato',
        limit: 2,
        types:
            "poi, locality,address, postcode, place,neighborhood,region, district,country",
        trackProximity: true,
        proximity: { longitude: -101.34714532142675, latitude: 20.672401307379573 },
    });
}

function crearMarcador(event, icono, popUp) {
    let coordenadas
    try {
        coordenadas = [event.result.geometry.coordinates[1], event.result.geometry.coordinates[0]]
    } catch (error) {
        coordenadas = event.latlng
    }
    return L.marker(coordenadas, {
        icon: icono,
        setView: true,
        maxZoom: 16,
        draggable: true
    }).bindPopup(popUp);
}

async function peticion(dir, datos) {

    return await fetch(dir, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    }).then((data) => data.json());
}


export { map, crearIcono, crearCapa, crearGeocoder, crearMarcador, peticion }