import { deepmerge } from '@fastify/deepmerge';
import { IConfigObject, IConfigValue } from '@types';
import { getEnvironment } from '@utils';
import { getProperty } from 'dot-prop';
import fs from 'fs';
import path from 'path';
import TOML from 'smol-toml';

export class ConfigLoader {
  private static instance: ConfigLoader;
  private readonly configDir: string;
  private config: IConfigObject;

  /** Private constructor to prevent direct instantiation */
  private constructor() {
    this.configDir = path.resolve(process.cwd(), 'config');
    this.config = this.loadConfig();
  }

  /** Get the singleton instance of ConfigLoader */
  public static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  /** Load and merge configuration files */
  private loadConfig(): IConfigObject {
    const env = getEnvironment();
    const defaultConfig = this.loadTomlFile('default.toml');

    const envConfigFile = `${env}.toml`;
    const envConfig = this.loadTomlFile(envConfigFile);

    const envLocalConfigFile = `${env}.local.toml`;
    const envLocalConfig = this.loadTomlFile(envLocalConfigFile);

    // Merge configs with the following precedence: default < env < env.local
    const mergedConfig = deepmerge({ all: true })(defaultConfig, envConfig, envLocalConfig);
    return mergedConfig;
  }

  /** Load a TOML file and parse its content */
  private loadTomlFile(fileName: string): Record<string, IConfigValue> {
    const filePath = path.join(this.configDir, fileName);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return {}; // Return empty config if file doesn't exist
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return TOML.parse(fileContent) as Record<string, IConfigValue>;
  }

  /**
   *  Get a configuration value by key
   * @param key string - The configuration key (supports dot notation for nested properties)
   * @returns IConfigValue | undefined - The configuration value or undefined if not found
   */
  public getProperty(key: string): IConfigValue | undefined {
    const configVal: IConfigValue | undefined = getProperty(this.config, key);
    return configVal;
  }

  /**
   *  Get the entire configuration object
   * @returns IConfigObject - The merged configuration object
   */
  public getConfig(): IConfigObject {
    return this.config;
  }

  /**
   * Reload the configuration by re-reading the TOML files.
   * This can be useful if the configuration files are updated at runtime.
   */
  public reloadConfig(): void {
    this.config = this.loadConfig();
  }
}

/**
 * Helper function to get a configuration value by key
 * @param key - The configuration key (dot notation supported)
 * @returns The configuration value or undefined if not found
 */
export const getConfig = (key: string): IConfigValue | undefined =>
  ConfigLoader.getInstance().getProperty(key);
