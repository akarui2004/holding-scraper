import { Router } from 'express';

import productRoute from './product.routes';

const router: Router = Router();

router.use('/products', productRoute);

export default router;
