import { Router } from 'express';

import apiRoutes from './api';
import webRoutes from './web';
import opsRoutes from './ops';

const router: Router = Router();

// Mount versioned / grouped routes
router.use('/api', apiRoutes);
// router.use('/api/v2', apiV2Router);  // future versioning example

router.use('/web', webRoutes);
router.use('/ops', opsRoutes);

export default router;
