import { generatorHandler } from '@prisma/generator-helper';
import { getEnvPaths, parseEnvValue } from '@prisma/sdk';
import nodePlop from 'node-plop';
import * as path from 'path';
import { mergeRight, prop } from 'ramda';

import { transformDMMF } from './generator/transformDMMF';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const pkg = require('../package.json');

const formatAliases = {
  javascript: 'js',
  typescript: 'ts',
  js: 'js',
  ts: 'ts',
};
const withDefaults = mergeRight({
  outputFormat: formatAliases.js,
});

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './sequelize',
      prettyName: 'Sequelize Models',
    };
  },
  async onGenerate(options) {
    if (!options.generator.output) {
      throw new Error('No output was specified for Prisma Sequelize Generator');
    }

    const generatorConfig = withDefaults(options.generator.config);

    if (!Object.keys(formatAliases).includes(generatorConfig.outputFormat)) {
      throw new Error(`Incorrect output format was specified. Allowed formats are: ${Object.keys(formatAliases)}`);
    }
    const outputFormat = prop(generatorConfig.outputFormat as keyof typeof formatAliases, formatAliases);

    const outputDir =
      // This ensures previous version of prisma are still supported
      typeof options.generator.output === 'string'
        ? (options.generator.output as unknown as string)
        : parseEnvValue(options.generator.output);

    try {
      const plop = nodePlop(path.join(__dirname, '../plop/plopfile.js'), { destBasePath: outputDir, force: true });
      // const utilsGenerator = plop.getGenerator('utils');
      const indexGenerator = plop.getGenerator('index');
      const modelGenerator = plop.getGenerator('Model');

      const schemaDir = options.schemaPath ? path.dirname(options.schemaPath) : process.cwd();
      const schemaPath = path.join(schemaDir, 'prisma.schema');
      const envPaths = getEnvPaths(schemaPath, { cwd: outputDir });

      const config = {
        generator: options.generator,
        relativeEnvPaths: {
          rootEnvPath: envPaths.rootEnvPath && path.relative(outputDir, envPaths.rootEnvPath),
          schemaEnvPath: envPaths.schemaEnvPath && path.relative(outputDir, envPaths.schemaEnvPath),
        },
        // relativePath: path.relative(outputDir, schemaDir),
        // clientVersion: pkg.version,
        // engineVersion: options.version,
        // datasourceNames: options.datasources.map((d) => d.name),
        datasource: options.datasources[0],
      };
      // const relativeOutputDir = path.relative(process.cwd(), outputDir);
      // const slsRelativeOutputDir = path.relative(process.cwd(), outputDir).split(path.sep).slice(1).join(path.sep);

      const { models } = transformDMMF(options.dmmf);

      await Promise.all([
        // utilsGenerator.runActions({}),
        indexGenerator.runActions({ models, config: JSON.stringify(config, null, 2), outputFormat }),
        ...models.map((model) => modelGenerator.runActions({ ...model, outputFormat })),
      ]);
    } catch (e) {
      console.error('Error: unable to write files for Prisma Sequelize Generator');
      throw e;
    }
  },
});
