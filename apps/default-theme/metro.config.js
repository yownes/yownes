// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

module.exports = () => {
  const config = getDefaultConfig(projectRoot);
  const fullConfig = {
    ...config,
    watchFolders: [workspaceRoot],
    transformer: {
      ...(config.transformer ?? {}),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      ...config.resolver,
      nodeModulesPaths: [
        path.resolve(workspaceRoot, "node_modules"),
        path.resolve(projectRoot, "node_modules"),
      ],
      sourceExts: [...config.resolver.sourceExts, "cjs"], // @apollo/client >3.5
    },
  };
  return fullConfig;
};
