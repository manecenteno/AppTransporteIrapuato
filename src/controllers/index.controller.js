import Ruta from "../models/Ruta";
const indexController = {};

const filtroTrayecto = {
    _id: 0,
    recorrido1: {
        trayecto: 1,
        paradas: 1,
        longitud: 1
    },
    recorrido2: {
        trayecto: 1,
        paradas: 1,
        longitud: 1
    },
    recorridoAlternativo1: {
        trayecto: 1,
        longitud: 1
    },
    recorridoAlternativo2: {
        trayecto: 1,
        longitud: 1
    }
}

const filtroBase = {
    _id: 0,
    nombre: 1,
    numero: 1
}

const filtroHorarios = {
    _id: 0,
    nombre: 1,
    recorrido1: { primerServicio: 1, intervaloServicio: 1, ultimoServicio: 1 },
    recorrido2: { primerServicio: 1, intervaloServicio: 1, ultimoServicio: 1 }
}

const filtroCercana = {
    _id: 0,
    nombre: 1,
    numero: 1,
    recorrido1: { trayecto: 1, paradas: 1 },
    recorrido2: { trayecto: 1, paradas: 1 },
}

//********************************************************** */
//Render de inicio
indexController.renderInicio = (req, res) => {
    res.render("inicio");
};

//********************************************************** */
//Render de trayecto
indexController.renderTrayecto = async (req, res, next) => {
    await Ruta.find({}, filtroBase).lean().then((rutas) => {
        res.render("ruta/trayectoRuta", {
            rutas: rutas,
        });
    }).catch((err) => {
        res.status(400);
    });
};

indexController.obtenerRuta = async (req, res) => {
    let datosRuta;
    try {
        datosRuta = await Ruta.findOne({ nombre: req.body.nombre }, filtroTrayecto).lean();
        console.log(datosRuta)
    } catch (error) {
        res.json({ error: err });
    }
    res.json(datosRuta);
};

//********************************************************** */
//Render horarios

indexController.renderHorarios = async (req, res, next) => {
    await Ruta.find({}, filtroBase).lean().then((rutas) => {
        res.render("ruta/horariosRuta", {
            rutas: rutas,
        });
    }).catch((err) => {
        res.json({ error: err });
    });
};

indexController.horarios = async (req, res, next) => {
    await Ruta.findOne({ nombre: req.body.nombre }, filtroHorarios).lean().then((rutas) => {
        res.json(rutas);
    }).catch((err) => {
        res.json({ error: err });
    });
};

//********************************************************** */
//Render ruta cercana

indexController.renderCercana = async (req, res, next) => {
    res.render("ruta/cercanaRuta");
};

//Obtener ruta cercana

indexController.cercana = async (req, res, next) => {
    let rutas = await Ruta.find({}, filtroCercana).lean();

    let rutasUsuario = obtenerRutasUsuario(rutas, req.body)
    let rutasFinales = obtenerRutasDestino(rutasUsuario, req.body)
    res.send(rutasFinales);
};

//********************************************************** */
// Obtiene rutas cercanas a los usuarios

function obtenerRutasUsuario(rutas, body) {
    let cercanasPersona = [];
    console.log(rutas)
    for (let i = 0; i < rutas.length; i++) {

        // Ida
        let trayecto = rutas[i].recorrido1.trayecto
        let paradas = rutas[i].recorrido1.paradas
        let objRuta = obtenerRuta(0, trayecto.length, trayecto, body.coordenadasUsuario, 300, rutas[i].nombre, rutas[i].numero, "Ida", paradas)
        if (objRuta) {
            cercanasPersona.push(objRuta)
        }

        // Vuelta
        trayecto = rutas[i].recorrido2.trayecto
        paradas = rutas[i].recorrido2.paradas
        objRuta = obtenerRuta(0, trayecto.length, trayecto, body.coordenadasUsuario, 300, rutas[i].nombre, rutas[i].numero, "Vuelta", paradas)
        if (objRuta) {
            cercanasPersona.push(objRuta)
        }
    }

    return cercanasPersona
}


function obtenerRuta(indice, longitud, trayecto, coordenadas, metros, nombre, numero, sentido, paradas) {
    for (let j = indice; j < longitud; j++) {
        let punto = trayecto[j];
        let distancia = calculaDistancia([punto, coordenadas]);
        if (distancia <= metros) {
            return {
                nombre: nombre,
                numero: numero,
                recorrido: trayecto,
                indice: j,
                sentido: sentido,
                paradas: paradas
            };
        }
    }
    return undefined
}

//********************************************************** */
// Devuelve las rutas cercanas al destino

function obtenerRutasDestino(rutas, body) {
    let cercanasFinales = [];
    for (let i = 0; i < rutas.length; i++) {
        let trayecto = rutas[i].recorrido
        let objRuta = obtenerRuta(rutas[i].indice, trayecto.length, trayecto, body.coordenadasDestino, 500, rutas[i].nombre, rutas[i].numero, rutas[i].sentido, rutas[i].paradas)

        if (objRuta) {
            objRuta.indiceInicio = rutas[i].indice
            cercanasFinales.push(objRuta)
        }
    }

    for (let j = 0; j < cercanasFinales.length; j++) {
        let indiceInicio = cercanasFinales[j].indiceInicio;
        let indiceDestino = cercanasFinales[j].indice;
        let distancia = 0

        while (indiceInicio < indiceDestino) {
            distancia += calculaDistancia([cercanasFinales[j].recorrido[indiceInicio], cercanasFinales[j].recorrido[indiceInicio + 1]])
            indiceInicio++
        }

        cercanasFinales[j].distancia = Math.round(distancia / 1000)
    }

    cercanasFinales.sort((ruta1, ruta2) => {
        if (ruta1.distancia < ruta2.distancia) {
            return -1
        }
        else if (ruta1.distancia > ruta2.distancia) {
            return 1
        }
        else {
            return 0
        }
    })


    return cercanasFinales
}


//********************************************************** */
//Distancia
function calculaDistancia(coordenadas) {
    try {
        let R = 6378000;
        let distancia = 0;
        let rad = Math.PI / 180;
        for (let i = 0; i < coordenadas.length - 1; i++) {
            let lat1 = coordenadas[i][0] * rad;
            let lat2 = coordenadas[i + 1][0] * rad;
            let sinDLat = Math.sin(
                ((coordenadas[i + 1][0] - coordenadas[i][0]) * rad) / 2
            );
            let sinDLon = Math.sin(
                ((coordenadas[i + 1][1] - coordenadas[i][1]) * rad) / 2
            );
            let a =
                sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distancia += R * c;
        }
        return distancia;
    } catch (error) {
        return 0;
    }
}

export { indexController, calculaDistancia };
