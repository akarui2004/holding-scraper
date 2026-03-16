import { IEnvironment } from '@types';

export const getEnvironment = (): IEnvironment => {
  const env: IEnvironment = (process.env.NODE_ENV as IEnvironment) || 'development';
  return env;
};
