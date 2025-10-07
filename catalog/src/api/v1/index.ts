'use strict';

import express from 'express';
import spuRouter from './spu';
import skuRouter from './sku';
const router = express.Router();

router.use('/v1', spuRouter);
router.use('/v1', skuRouter);

export default router;
