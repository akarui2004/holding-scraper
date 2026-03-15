// 1. Load default config from config/default.toml
//   1.1 Use singleton pattern to ensure config is loaded only once and shared across the application
// 2. Load environment-specific config from config/{NODE_ENV}.toml and override default config
// 3. Load environment variables and override config with the same key

import path from 'path';

// 4. Reload config if config file changes
class ConfigLoader {
  private static instance: ConfigLoader;
  private readonly configDir: string;

  private constructor() {
    this.configDir = path.resolve(process.cwd(), 'config');
  }

  public static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }

    return ConfigLoader.instance;
  }

  public getConfigDir() {
    return this.configDir;
  }
}

const getConfig = () => ConfigLoader.getInstance().getConfigDir();
console.log(getConfig());
