import { indexBy, prop } from 'ramda';

import { PrismaTypeToSequelizeType } from './properties';

import type { DMMF } from '@prisma/generator-helper';

export function transformDMMF(dmmf: DMMF.Document) {
  const enumIndex = indexBy(prop('name'), dmmf.datamodel.enums ?? []);

  return {
    models: dmmf.datamodel.models.map((model) => {
      const attributes = model.fields.map((field) => field.name);

      return {
        ...model,
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
      };
    }),
  };
}
