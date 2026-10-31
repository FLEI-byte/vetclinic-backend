import { Router } from 'express';

import { list, show, create, update, destroy } from 'controllers/medical-cards';
import { checkJwt } from 'middleware/checkJwt';
import { validatorCreateMedicalCard } from 'middleware/validation/medical-cards/validatorCreateMedicalCard';
import { validatorUpdateMedicalCard } from 'middleware/validation/medical-cards/validatorUpdateMedicalCard';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id([0-9]+)', [checkJwt], show);
router.post('/', [checkJwt, validatorCreateMedicalCard], create);
router.patch('/:id([0-9]+)', [checkJwt, validatorUpdateMedicalCard], update);
router.delete('/:id([0-9]+)', [checkJwt], destroy);

export default router;
