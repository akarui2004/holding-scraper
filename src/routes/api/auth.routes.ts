import { Router } from 'express';

const router: Router = Router();

router.get('/credentials', (_req, res) => {
  res.json({ message: 'Authentication route' });
});

export default router;
