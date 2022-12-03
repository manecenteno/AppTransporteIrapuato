import mongoose from "mongoose";

const rutaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
        },
        numero: {
            type: String,

        },
        recorrido1: {
            trayecto: {
                type: [[Number]],

            },
            paradas: {
                type: [[Number]],

            },
            primerServicio: {
                type: String,

            },
            intervaloServicio: {
                type: String,

            },
            ultimoServicio: {
                type: String,

            },
            longitud: {
                type: Number,

            }
        },
        recorrido2: {
            trayecto: {
                type: [[Number]],

            },
            paradas: {
                type: [[Number]],

            },
            primerServicio: {
                type: String,

            },
            intervaloServicio: {
                type: String,

            },
            ultimoServicio: {
                type: String,

            },
            longitud: {
                type: Number,

            }
        },
        recorridoAlternativo1: {
            trayecto: {
                type: [[Number]],

            },
            longitud: {
                type: Number,

            }
        },
        recorridoAlternativo2: {
            trayecto: {
                type: [[Number]],

            },
            longitud: {
                type: Number,

            }
        }
    },
    {
        versionKey: false,
    }
);

export default mongoose.model("Route", rutaSchema);
