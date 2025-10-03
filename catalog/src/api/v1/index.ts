'use strict';

import express from 'express';
import spuRouter from './spu';
const router = express.Router();

router.use('/v1', spuRouter);

export default router;
