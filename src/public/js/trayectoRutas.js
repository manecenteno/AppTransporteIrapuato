import { map, crearIcono, crearCapa, peticion } from './mapa.js'

let mapa = map;

//Marcadores de inicio y fin de la ruta
let rutaIda, rutaVuelta, rutaAltIda, rutaAltVuelta;
let controlCapas = L.control.layers().addTo(mapa);
let lista = document.getElementById("listaRutas")

//Manejador del evento al cambiar el select
dselect(lista, {
    search: true,
    maxHeight: '200px'
});

lista.addEventListener("change", async (e) => {
    let nombre = { nombre: document.getElementById("listaRutas").value };
    let msg = document.getElementById("msg")
    if (msg) {
        msg.remove()
    }
    rutaPintada();

    //Peticion para buscar la ruta y obtener datos
    let datosRuta = await peticion("/trayecto", nombre)
    configurarCapas(datosRuta);
});

// Eliminar capas
function rutaPintada() {
    if (rutaIda) {
        rutaIda.clearLayers();
        // map.removeLayer(rutaIda);
        controlCapas.removeLayer(rutaIda);
    }
    if (rutaVuelta) {
        rutaVuelta.clearLayers();
        controlCapas.removeLayer(rutaVuelta);
    }

    if (rutaAltIda) {
        rutaAltIda.clearLayers();
        controlCapas.removeLayer(rutaAltIda);
    }

    if (rutaAltVuelta) {
        rutaAltVuelta.clearLayers();
        controlCapas.removeLayer(rutaAltVuelta);
    }
}

function configurarCapas(datosRuta) {
    let iconoInicioIda = crearIcono("../img/marcadorInicioIda.png");
    let iconoFinIda = crearIcono("../img/marcadorFinIda.png");
    let iconoInicioVuelta = crearIcono("../img/marcadorInicioVuelta.png");
    let iconoFinVuelta = crearIcono("../img/marcadorFinVuelta.png");
    let iconoParadas = crearIcono("../img/parada.png")

    

    // Ida
    rutaIda = crearCapa(
        datosRuta.recorrido1.trayecto,
        "green",
        iconoInicioIda,
        iconoFinIda,
        "Aquí inicia la ruta de ida",
        "Aquí termina la ruta de ida",
        datosRuta.recorrido1.paradas, 
        iconoParadas
    );

    //Regreso
    rutaVuelta = crearCapa(
        datosRuta.recorrido2.trayecto,
        "red",
        iconoInicioVuelta,
        iconoFinVuelta,
        "Aquí inicia la ruta de vuelta",
        "Aquí termina la ruta de vuelta",
        datosRuta.recorrido2.paradas,
        iconoParadas
    );

    let longitudIda = Math.round(datosRuta.recorrido1.longitud / 1000)
    let longitudVuelta = Math.round(datosRuta.recorrido2.longitud / 1000)


    controlCapas.addOverlay(rutaIda, `Ida, Aprox: ${longitudIda} km.`);
    controlCapas.addOverlay(rutaVuelta, `Vuelta, Aprox: ${longitudVuelta} km.`);

    if (datosRuta.recorridoAlternativo1.trayecto.length > 0) {
        let iconoInicioAltIda = crearIcono("../img/marcadorInicioAltIda.png");
        let iconoFinAltIda = crearIcono("../img/marcadorFinAltIda.png");
        let longitud = Math.round(datosRuta.recorridoAlternativo1.longitud / 1000)

        rutaAltIda = crearCapa(
            datosRuta.recorridoAlternativo1.trayecto,
            "blue",
            iconoInicioAltIda,
            iconoFinAltIda,
            "Aquí inicia la ruta alternativa de ida",
            "Aquí termina la ruta alternativa de ida"
        )

        controlCapas.addOverlay(rutaAltIda, `Alternativo Ida, Aprox: ${longitud} km.`);
    }
    if (datosRuta.recorridoAlternativo2.trayecto.length > 0) {
        let iconoInicioAltVuelta = crearIcono("../img/marcadorInicioAltVuelta.png");
        let iconoFinAltVuelta = crearIcono("../img/marcadorFinAltVuelta.png");
        let longitud = Math.round(datosRuta.recorridoAlternativo2.longitud / 1000)

        rutaAltVuelta = crearCapa(
            datosRuta.recorridoAlternativo2.trayecto,
            "#FF0080",
            iconoInicioAltVuelta,
            iconoFinAltVuelta,
            "Aquí inicia la ruta alternativa de vuelta",
            "Aquí termina la ruta alternativa de vuelta"
        )
        controlCapas.addOverlay(rutaAltVuelta, `Alternativo Vuelta, Aprox: ${longitud} km.`);
    }
}

