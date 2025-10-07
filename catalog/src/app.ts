import express, { Request, Response, NextFunction, Express } from 'express';
import 'module-alias/register';
import { asyncHandler } from './helpers';
import router from '@/api';
import cors from 'cors';
import { httpLogger, HandleErrorWithLogger } from './utils';
const PORT = 5000;
import { connectDB } from './db';
import { BrokerService } from './services/broker.service';
import { ElasticSearchService } from './services';
import { AppEventListener } from './utils/AppEventListener';
import instanceMongoDB from './db/mongoose.init';
const userApp = async (app: Express) => {
  app.use(express.json());
  app.use(
    cors({
      origin: ['http://localhost:6000/api/cart'],
      methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
      credentials: true, // Cho phép sử dụng credentials mode
    })
  );

  // connect to db
  //   connectDB();
  instanceMongoDB;

  const brokerService = new BrokerService();
  
  //endpoints
  brokerService.initializeBroker();
  //initialize elasticsearch service
  const elasticSearchService = new ElasticSearchService();
  AppEventListener.instance.listen(elasticSearchService);
  //link to router

  // router
  app.use('/catalog/', router);

  //midleware
  app.use(httpLogger);

  //handling error notfound
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error('Not found api');
    error.status = 404;
    next(error);
  });

  //handling error
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status: number = error.status || 500;
    res.status(status).json({
      status: status,
      message: error.message,
      stack: error.stack,
    });
  });
  // app.use(HandleErrorWithLogger);
};
export default userApp;
