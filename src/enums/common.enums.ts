export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

type EnvKey = keyof typeof Environment;
export const getEnvEnum = (key: EnvKey) => Environment[key];
