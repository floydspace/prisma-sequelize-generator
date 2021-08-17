import { generatorHandler } from '@prisma/generator-helper';
import { parseEnvValue } from '@prisma/sdk';
import nodePlop from 'node-plop';
import * as path from 'path';

import { PrismaTypeToSequelizeType } from './mappers';

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
      const plop = nodePlop(path.join(__dirname, '../.plop/plopfile.js'), { destBasePath: outputDir, force: true });
      const indexGenerator = plop.getGenerator('index.ts');
      const modelGenerator = plop.getGenerator('Model.ts');

      await Promise.all([
        indexGenerator.runActions({ models: options.dmmf.datamodel.models }),
        ...options.dmmf.datamodel.models.map((model) =>
          modelGenerator.runActions({
            model,
            scalarFields: model.fields
              .filter((field) => field.kind === 'scalar')
              .map((field) => ({
                name: field.name,
                type: PrismaTypeToSequelizeType[field.type],
              })),
          })
        ),
      ]);
    } catch (e) {
      console.error('Error: unable to write files for Prisma Sequelize Generator');
      throw e;
    }
  },
});
