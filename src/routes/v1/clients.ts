import { Router } from 'express';

import { list, show, create, update, destroy } from 'controllers/clients';
import { checkJwt } from 'middleware/checkJwt';
import { validatorCreateClient } from 'middleware/validation/clients/validatorCreateClient';
import { validatorUpdateClient } from 'middleware/validation/clients/validatorUpdateClient';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id([0-9]+)', [checkJwt], show);
router.post('/', [checkJwt, validatorCreateClient], create);
router.patch('/:id([0-9]+)', [checkJwt, validatorUpdateClient], update);
router.delete('/:id([0-9]+)', [checkJwt], destroy);

export default router;
