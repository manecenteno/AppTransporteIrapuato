import { Router } from 'express';
import {indexController} from '../controllers/index.controller';

const router = Router();

//Renderizado de la página inicial
router.get('/', indexController.renderInicio);

//Renderizado trayecto
router.get('/trayecto', indexController.renderTrayecto);

router.post('/trayecto', indexController.obtenerRuta);

//Renderizado de la pagina horarios
router.get('/horarios', indexController.renderHorarios);
router.post('/horarios', indexController.horarios)

//Renderizado de la pagina ruta cercana

router.get('/cercana', indexController.renderCercana)
router.post('/cercana', indexController.cercana)


export default router;
