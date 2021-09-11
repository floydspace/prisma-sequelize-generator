import { indexBy, prop } from 'ramda';
import { generatorHandler } from '@prisma/generator-helper';
import { parseEnvValue, getEnvPaths } from '@prisma/sdk';
import nodePlop from 'node-plop';
import * as path from 'path';

import { PrismaTypeToSequelizeType } from './mappers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const pkg = require('../package.json');

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './models',
      prettyName: 'Sequelize Models',
    };
  },
  async onGenerate(options) {
    if (!options.generator.output) {
      throw new Error('No output was specified for Prisma Sequelize Generator');
    }

    const outputDir =
      // This ensures previous version of prisma are still supported
      typeof options.generator.output === 'string'
        ? (options.generator.output as unknown as string)
        : parseEnvValue(options.generator.output);

    try {
      const plop = nodePlop(path.join(__dirname, '../plop/plopfile.js'), { destBasePath: outputDir, force: true });
      const utilsGenerator = plop.getGenerator('utils');
      const indexGenerator = plop.getGenerator('index.ts');
      const modelGenerator = plop.getGenerator('Model.ts');

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
      const relativeOutputDir = path.relative(process.cwd(), outputDir);
      const slsRelativeOutputDir = path.relative(process.cwd(), outputDir).split(path.sep).slice(1).join(path.sep);

      const enumIndex = indexBy(prop('name'), options.dmmf.datamodel.enums ?? []);

      await Promise.all([
        utilsGenerator.runActions({}),
        indexGenerator.runActions({
          models: options.dmmf.datamodel.models,
          config: JSON.stringify(config, null, 2),
          relativeOutputDir,
          slsRelativeOutputDir,
        }),
        ...options.dmmf.datamodel.models.map((model) => {
          const attributes = model.fields.map((field) => field.name);
          return modelGenerator.runActions({
            model,
            scalarFields: model.fields
              .filter((field) => ['scalar', 'enum'].includes(field.kind))
              .filter((field) => !['createdAt', 'updatedAt', 'deletedAt'].includes(field.name))
              .map((field) => ({
                ...field,
                name: field.name,
                type:
                  field.kind === 'scalar'
                    ? PrismaTypeToSequelizeType[field.type]
                    : `ENUM(${enumIndex[field.type].values
                        .map(prop('name'))
                        .map((n) => `'${n}'`)
                        .join(', ')})`,
                allowNull: !field.isRequired,
                isAutoincrement:
                  field.hasDefaultValue && typeof field.default === 'object' && field.default.name === 'autoincrement',
              })),
            belongsToFields: model.fields
              .filter((field) => field.kind === 'object')
              .filter((field) => !field.isList && field.relationToFields?.length)
              .map((field) => ({
                as: field.name,
                name: field.type,
                targetKey: field.relationToFields![0],
                foreignKey: field.relationFromFields[0],
              })),
            hasOneFields: model.fields
              .filter((field) => field.kind === 'object')
              .filter((field) => !field.isList && !field.relationToFields?.length)
              .map((field) => ({
                as: field.name,
                name: field.type,
              })),
            hasManyFields: model.fields
              .filter((field) => field.kind === 'object')
              .filter((field) => field.isList)
              .map((field) => ({
                as: field.name,
                name: field.type,
              })),
            hasCreatedAt: attributes.includes('createdAt'),
            hasUpdatedAt: attributes.includes('updatedAt'),
            hasDeletedAt: attributes.includes('deletedAt'),
          });
        }),
      ]);
    } catch (e) {
      console.error('Error: unable to write files for Prisma Sequelize Generator');
      throw e;
    }
  },
});
