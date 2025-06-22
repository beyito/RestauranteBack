import { Router } from 'express'
import { autenticacion, autorizacion } from '../../middleware/authPermiso.js'
import { ControladorAdministrador } from '../controllers/administrador.js'

export const crearRutaAdministrador = ({ modelAdministrador, token, modeloBitacora }) => {
  const rutaAdministrador = Router()
  const controladorAdmin = new ControladorAdministrador({ modelAdministrador, modeloBitacora })

  rutaAdministrador.use(autenticacion(token))

  rutaAdministrador.get('/panelAdministrativo', autorizacion([1]), controladorAdmin.adminDashboard)
  rutaAdministrador.get('/bitacora', controladorAdmin.consultarBitacora)
  return rutaAdministrador
}
