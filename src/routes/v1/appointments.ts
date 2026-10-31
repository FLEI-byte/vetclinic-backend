import { Router } from 'express';

import { list, show, create, update, destroy } from 'controllers/appointments';
import { checkJwt } from 'middleware/checkJwt';
import { validatorCreateAppointment } from 'middleware/validation/appointments/validatorCreateAppointment';
import { validatorUpdateAppointment } from 'middleware/validation/appointments/validatorUpdateAppointment';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id([0-9]+)', [checkJwt], show);
router.post('/', [checkJwt, validatorCreateAppointment], create);
router.patch('/:id([0-9]+)', [checkJwt, validatorUpdateAppointment], update);
router.delete('/:id([0-9]+)', [checkJwt], destroy);

export default router;
