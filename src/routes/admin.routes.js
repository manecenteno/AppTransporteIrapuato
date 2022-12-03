import { Router } from 'express';
import rutaController from '../controllers/ruta.controller';
const router = Router();
import helpers from '../helpers/autenticacion'

//Renderizado del login
router.get('/acceso', rutaController.renderLogin);

router.post('/acceso', rutaController.login)

//Ver rutas
router.get('/ver-rutas', helpers.isAuthenticated, rutaController.verRutas);

//Añadir ruta
router.get('/anadir-ruta', helpers.isAuthenticated, rutaController.renderAgregarRuta);
router.post('/anadir-ruta', helpers.isAuthenticated, rutaController.agregarRuta);

//Editar ruta
router.get('/editar-ruta/:id', helpers.isAuthenticated, rutaController.renderActualizarRuta);
router.post('/editar-ruta/:id', helpers.isAuthenticated, rutaController.actualizarRuta);

//Elminar ruta
router.get('/eliminar-ruta/:id', helpers.isAuthenticated, rutaController.eliminarRuta)

export default router;