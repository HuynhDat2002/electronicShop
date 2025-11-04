'use strict';

import express from 'express';
import spuRouter from './spu';
import skuRouter from './sku';
import variationRouter from './variant';
import inventoryRouter from './inventory';
import attributeRouter from './attribute';
import reservationRouter from './reservation';
const router = express.Router();

router.use('/v1', spuRouter);
router.use('/v1', skuRouter);
router.use('/v1', variationRouter);
router.use('/v1', inventoryRouter);
router.use('/v1', attributeRouter);
router.use('/v1', reservationRouter);

export default router;
