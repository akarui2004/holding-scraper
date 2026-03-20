import { Router } from 'express';

const router: Router = Router();

router.get('/catalog', (_req, res) => {
  res.json({ message: 'Catalog route' });
});

export default router;
