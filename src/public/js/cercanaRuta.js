import {
    map,
    crearIcono,
    crearGeocoder,
    crearMarcador,
    peticion,
    crearCapa,
} from "./mapa.js";

let rutas, trayecto, dirInicio, dirDestino;
let mapa = map;
let usuario = crearIcono("../img/iconoUsuario.gif");
let destino = crearIcono("../img/destino.gif");
const modalRutas = document.querySelector("#modalRutas");
const modal = new bootstrap.Modal(modalRutas);
const modalEspera = document.getElementById("modalEspera");
const espera = new bootstrap.Modal(modalEspera);

let marcadorUsuario = crearMarcador(
    { latlng: { lat: 20.7529314553107, lng: -101.33427363866878 } },
    usuario,
    "Puedes mover el marcador"
);
marcadorUsuario.addTo(mapa);

let marcadorDestino = crearMarcador(
    { latlng: { lat: 20.67817084394109, lng: -101.34514359790406 } },
    destino,
    "Puedes mover el marcador"
);
marcadorDestino.addTo(mapa);

// Obtener ubicación
document.getElementById("ubicacion").addEventListener("click", localizar);

function localizar() {
    mapa.on("locationfound", ubiEncontrada);
    mapa.on("locationerror", ubiNoEncontrada);
    mapa.locate({ enableHighAccuracy: true });
}

function ubiEncontrada(e) {
    if (marcadorUsuario) {
        mapa.removeLayer(marcadorUsuario);
    }
    marcadorUsuario = crearMarcador(e, usuario, "Aquí estás");
    let latitud = marcadorUsuario._latlng.lat;
    let longitud = marcadorUsuario._latlng.lng;
    inputInicio.value = `lat: ${latitud},lng: ${longitud}`;
    dirInicio = `lat: ${latitud},lng: ${longitud}`;
    marcadorUsuario.addTo(mapa);
    mapa.setView(marcadorUsuario._latlng, 18);
}

function ubiNoEncontrada(e) {
    alert(e.message);
}

// Crear los geocoders
// Geocoder Inicio

let geocoderInicio = crearGeocoder("Escriba el inicio");
geocoderInicio.addTo("#usuario");

geocoderInicio.on("result", (event) => {
    if (marcadorUsuario) {
        mapa.removeLayer(marcadorUsuario);
    }
    marcadorUsuario = crearMarcador(event, usuario, "Aquí estás");
    marcadorUsuario.addTo(mapa);
    mapa.setView(marcadorUsuario._latlng, 18);
    dirInicio = inputInicio.value;
});

let inputInicio = document
    .getElementById("usuario")
    .getElementsByClassName("mapboxgl-ctrl-geocoder--input")[0];

dirInicio = inputInicio.value =
    "Instituto Tecnológico Superior de Irapuato (ITESI), Carr. Irapuato - Silao Km. 12.5, Irapuato, Guanajuato 36824, México";

// Geocoder destino

let geocoderDestino = crearGeocoder("Escriba el destino");

geocoderDestino.addTo("#destino");

geocoderDestino.on("result", (event) => {
    if (marcadorDestino) {
        mapa.removeLayer(marcadorDestino);
    }
    marcadorDestino = crearMarcador(event, destino, "Aquí quieres ir");
    marcadorDestino.addTo(mapa);
    mapa.setView(marcadorDestino._latlng, 18);
    dirDestino = inputDestino.value;
});

const inputDestino = document
    .getElementById("destino")
    .getElementsByClassName("mapboxgl-ctrl-geocoder--input")[0];

dirDestino = inputDestino.value =
    "Plaza Manuel J. Clouthier, Bulevar Diaz Ordaz, Irapuato, Guanajuato, México";

// Buscar ruta
document.getElementById("buscar").addEventListener("click", rutaCercana);

async function rutaCercana() {
    let titulo = document.getElementById("titulo");
    let pie = document.getElementById("pieModal");
    if (!marcadorUsuario || !marcadorDestino) {
        alert("Verifica tu ubicación y el destino");
        return;
    } else {
        let distancia = mapa.distance(
            marcadorUsuario._latlng,
            marcadorDestino._latlng
        );
        if (distancia < 1000) {
            alert(
                "Tu destino se encuentra a menos de 1km, si es posible, es conveniente caminar"
            );
        }
        espera.show();
        inputInicio.value = dirInicio;
        inputDestino.value = dirDestino;
        let coordenadas = {
            coordenadasUsuario: [
                marcadorUsuario._latlng.lat,
                marcadorUsuario._latlng.lng,
            ],
            coordenadasDestino: [
                marcadorDestino._latlng.lat,
                marcadorDestino._latlng.lng,
            ],
        };

        rutas = await peticion("/cercana", coordenadas);

        espera.hide();

        if (rutas.length > 0) {
            while (lista.firstChild) {
                lista.removeChild(lista.firstChild);
            }
            for (let i = 0; i < rutas.length; i++) {
                const lista = document.getElementById("lista");

                lista.innerHTML += `<button class="list-group-item w-100" onclick="pintarRuta(${i});">
                ${rutas[i].numero} ${rutas[i].nombre} <br>Sentido: ${rutas[i].sentido}
                <br> Distancia aprox. del recorrido: ${rutas[i].distancia} km. </button>`;
                pie.textContent =
                    " Para asegurar que el autobus se pueda detener, dirígete a una parada oficial.";
            }
            titulo.textContent = "Puedes elegir entre las siguientes rutas:";
            modal.show();
        } else {
            titulo.textContent = "Lo sentimos";
            lista.innerHTML =
                "<h5>No se encontraron rutas dentro de un rango de 500 metros de la ubicación de inicio</h5>";
            modal.show();
        }
    }
}

window.pintarRuta = pintarRuta;

function pintarRuta(indice) {
    let iconoInicio = crearIcono("../img/marcadorInicioAltVuelta.png");
    let iconoFin = crearIcono("../img/marcadorFinAltVuelta.png");
    let iconoParadas = crearIcono("../img/parada.png")
    console.log(rutas)
    if (trayecto) {
        mapa.removeLayer(trayecto);
    }
    trayecto = crearCapa(
        rutas[indice].recorrido,
        "#FF0080",
        iconoInicio,
        iconoFin,
        "Aquí inicia la ruta",
        "Aquí termina la ruta",
        rutas[indice].paradas,
        iconoParadas
    );
    trayecto.addTo(mapa);
    modal.hide();
}

marcadorUsuario.on("drag", function (e) {
    let latitud = marcadorUsuario._latlng.lat;
    let longitud = marcadorUsuario._latlng.lng;
    inputInicio.value = `lat: ${latitud},lng: ${longitud}`;
    dirInicio = `lat: ${latitud},lng: ${longitud}`;
});

marcadorDestino.on("drag", function (e) {
    let latitud = marcadorDestino._latlng.lat;
    let longitud = marcadorDestino._latlng.lng;
    inputDestino.value = `lat: ${latitud},lng: ${longitud}`;
    dirDestino = `lat: ${latitud},lng: ${longitud}`;
});
