export * from './error';
export * from './fixtures';
export * from './logger';
export * from './requestValidator';
export * from './cloud/imagekit.utils';
export * from './successResponse';
export * from './AppEventListener'
import _ from 'lodash';


export const omitData = <T>(fields: string[], object: any): T => {
  return _.omit(object, fields) as unknown as T;
};