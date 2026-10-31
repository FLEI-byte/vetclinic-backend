import { Router } from 'express';

import { list, show, create, update, destroy } from 'controllers/employees';
import { checkJwt } from 'middleware/checkJwt';
import { validatorCreateEmployee } from 'middleware/validation/employees/validatorCreateEmployee';
import { validatorUpdateEmployee } from 'middleware/validation/employees/validatorUpdateEmployee';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id([0-9]+)', [checkJwt], show);
router.post('/', [checkJwt, validatorCreateEmployee], create);
router.patch('/:id([0-9]+)', [checkJwt, validatorUpdateEmployee], update);
router.delete('/:id([0-9]+)', [checkJwt], destroy);

export default router;
