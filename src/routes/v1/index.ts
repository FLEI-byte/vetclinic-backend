import { Router } from 'express';

import appointments from './appointments';
import auth from './auth';
import clients from './clients';
import employees from './employees';
import medicalCards from './medical-cards';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/clients', clients);
router.use('/employees', employees);
router.use('/medical-cards', medicalCards);
router.use('/appointments', appointments);

export default router;
