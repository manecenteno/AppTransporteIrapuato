//Importacion de los modulos necesarios para el proyecto
import express, { urlencoded } from "express";
import indexRoutes from "./routes/index.routes";
import adminRoutes from "./routes/admin.routes";
import { create } from "express-handlebars";
import path from "path";
import passport from "passport";
import session from "express-session";
import './config/passport'

const app = express();

//Declaración de la ruta de las vistas
app.set("views", path.join(__dirname, "views")); //path.join obtiene la ruta absoluta y concatena la carpeta views

//Configuracion del motor de platilla
app.engine(
    ".hbs",
    create({
        layoutsDir: path.join(app.get("views"), "layouts"), //Carpeta de las plantillas
        defaultLayout: "navUsuarios",
        extname: ".hbs",
    }).engine
);
app.set("view engine", ".hbs");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

//Rutas
app.use(indexRoutes);
app.use(adminRoutes);
app.use(express.static(path.join(__dirname, "public")));

app.use(function (err, req, res, next) {
    res.status(422).send({ error: err.message });
});

//Exportacion del modulo
export default app;
