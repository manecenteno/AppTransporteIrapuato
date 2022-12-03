import { connect } from 'mongoose';
import {MONGODB_URI} from './config'

// Conexion a la base de datos
(async () => {
    try {
        const db = await connect(MONGODB_URI);
        console.log("Connected to", db.connection.name);
    }
    catch (error) {
        console.error(error);
    }
})();
 