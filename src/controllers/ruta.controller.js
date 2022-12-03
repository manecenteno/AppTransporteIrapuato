import Ruta from "../models/Ruta";
import { calculaDistancia } from "./index.controller";
const rutaController = {};
import passport from "passport";

//********************************************************** */
//Log in de administrador
rutaController.renderLogin = async (req, res, next) => {
    res.render("admin/loginAdmin", {
        layout: "accessAdmin",
    });
};

rutaController.login = passport.authenticate("local", {
    failureRedirect: "/acceso",
    successRedirect: "/ver-rutas",
});

//********************************************************** */
//Renderizado de pagina para agregar ruta

rutaController.renderAgregarRuta = async (req, res, next) => {
    res.render("admin/agregarRuta", {
        layout: "navAdmin",
    });
};

//*********************************************************** */
//Agregar una nueva ruta

rutaController.agregarRuta = async (req, res, next) => {
    const datosRuta = Ruta(formatoJSON(req.body));
    datosRuta
        .save()
        .then(() => {
            res.redirect("/ver-rutas");
        })
        .catch(next);
};

//********************************************************** */
//Ver rutas

rutaController.verRutas = async (req, res, next) => {
    await Ruta.find(
        {},
        {
            recorrido1: 0,
            recorrido2: 0,
            recorridoAlternativo1: 0,
            recorridoAlternativo2: 0,
        }
    )
        .lean()
        .then((rutas) => {
            res.render("admin/verRutas", {
                layout: "navAdmin",
                rutas: rutas,
            });
        })
        .catch((err) => {
            res.status(400);
        });
};

//********************************************************** */
//Renderizado de pagina para editar ruta

rutaController.renderActualizarRuta = async (req, res, next) => {
    var idRoute = req.params.id;
    await Ruta.findById(idRoute, {
        recorrido1: { longitud: 0 },
        recorrido2: { longitud: 0 },
        recorridoAlternativo1: { longitud: 0 },
        recorridoAlternativo2: { longitud: 0 },
    })
        .lean()
        .then((ruta) => {
            ruta.recorrido1.trayecto = JSON.stringify(ruta.recorrido1.trayecto).slice(1, -1);
            ruta.recorrido1.paradas = JSON.stringify(ruta.recorrido1.paradas).slice(1, -1);
            ruta.recorrido2.trayecto = JSON.stringify(ruta.recorrido2.trayecto).slice(1, -1);
            ruta.recorrido2.paradas = JSON.stringify(ruta.recorrido2.paradas).slice(1, -1);
            ruta.recorridoAlternativo1.trayecto = JSON.stringify(ruta.recorridoAlternativo1.trayecto).slice(1, -1);
            ruta.recorridoAlternativo2.trayecto = JSON.stringify(ruta.recorridoAlternativo2.trayecto).slice(1, -1);
            res.render("admin/actualizarRuta", {
                layout: "navAdmin",
                ruta: ruta,
            });
        });
};

//********************************************************** */
//Actualizar ruta

rutaController.actualizarRuta = async (req, res, next) => {
    let datosRuta = Ruta(formatoJSON(req.body));
    const objFiltrado = JSON.parse(JSON.stringify(datosRuta), function (k, v) {
        if (k !== "_id") return v;
    });
    await Ruta.findByIdAndUpdate(req.params.id, objFiltrado)
        .then(() => {
            res.redirect("/ver-rutas");
        })
        .catch((err) => {
            res.send(err);
        });
};

//********************************************************** */
//Eliminar ruta

rutaController.eliminarRuta = async (req, res, next) => {
    await Ruta.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect("/ver-rutas");
        })
        .catch((err) => {
            res.send("Error");
        });
};

//********************************************************** */
//Creación del objeto de acuerdo al modelo

function formatoJSON(body) {
    let trayectoIda = convertirToArray("[" + body.trayectoIda + "]");
    let trayectoVuelta = convertirToArray("[" + body.trayectoVuelta + "]");
    let trayectoAltIda = convertirToArray("[" + body.trayectoAltIda + "]");
    let trayectoAltVuelta = convertirToArray("[" + body.trayectoAltVuelta + "]");

    return {
        nombre: body.nombreRuta,
        numero: body.numeroRuta,
        recorrido1: {
            trayecto: trayectoIda,
            paradas: convertirToArray("[" + body.paradasIda + "]"),
            primerServicio: body.primerServicioIda,
            intervaloServicio: body.intervaloSalidaIda,
            ultimoServicio: body.ultimoServicioIda,
            longitud: calculaDistancia(trayectoIda),
        },
        recorrido2: {
            trayecto: trayectoVuelta,
            paradas: convertirToArray("[" + body.paradasVuelta + "]"),
            primerServicio: body.primerServicioVuelta,
            intervaloServicio: body.intervaloSalidaVuelta,
            ultimoServicio: body.ultimoServicioVuelta,
            longitud: calculaDistancia(trayectoVuelta),
        },
        recorridoAlternativo1: {
            trayecto: trayectoAltIda,
            longitud: calculaDistancia(trayectoAltIda),
        },
        recorridoAlternativo2: {
            trayecto: trayectoAltVuelta,
            longitud: calculaDistancia(trayectoAltVuelta),
        },
    };
}

//********************************************************** */
//Dar forma al objeto de acuerdo al modelo

//********************************************************** */
//Transformar entradas a JSON
function convertirToArray(coords) {
    try {
        coords = JSON.parse(coords);
        if (coords[0][0] < 0) {
            for (let i = 0; i < coords.length; i++) {
                let aux = coords[i][0];
                coords[i][0] = coords[i][1];
                coords[i][1] = aux;
            }
        }
        return coords;
    } catch {
        return undefined;
    }
}

export default rutaController;
