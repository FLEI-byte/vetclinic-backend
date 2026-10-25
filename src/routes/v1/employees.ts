import { Router } from 'express';

import { list, show, create, update, destroy } from 'controllers/employees';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id([0-9]+)', [checkJwt], show);
router.post('/', [checkJwt], create);
router.patch('/:id([0-9]+)', [checkJwt], update);
router.delete('/:id([0-9]+)', [checkJwt], destroy);

export default router;
