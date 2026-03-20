import { Router } from 'express';

const router: Router = Router();

router.get('/message', (_req, res) => {
  res.json({ message: 'Monitoring message route' });
});

export default router;
