import { Router } from 'express';

import monitoringRoute from './monitoring.routes';

const router: Router = Router();

router.use('/monitoring', monitoringRoute);

export default router;
