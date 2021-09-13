import { morphism, Schema } from 'morphism';
import { compose, includes, indexBy, map, not, prop } from 'ramda';

import { ModelProperties, PrismaTypeToSequelizeType, RelationProperties, ScalarProperties } from './properties';

import type { DMMF } from '@prisma/generator-helper';

export function transformDMMF(dmmf: DMMF.Document) {
  const enumIndex = indexBy(prop('name'), dmmf.datamodel.enums ?? []);

  const scalarMorphism = morphism<Schema<ScalarProperties, DMMF.Field>>({
    isList: 'isList',
    hasDefaultValue: 'hasDefaultValue',
    default: 'default',
    isId: 'isId',
    isUnique: 'isUnique',
    name: 'name',
    type: (field: DMMF.Field) =>
      field.kind === 'scalar'
        ? PrismaTypeToSequelizeType[field.type]
        : `ENUM(${enumIndex[field.type].values
            .map(prop('name'))
            .map((n) => `'${n}'`)
            .join(', ')})`,
    allowNull: { path: 'isRequired', fn: not },
    isAutoincrement: (field: DMMF.Field) =>
      field.hasDefaultValue && typeof field.default === 'object' && field.default.name === 'autoincrement',
  });

  const relationMorphism = morphism<Schema<RelationProperties, DMMF.Field>>({
    as: 'name',
    name: 'type',
    targetKey: 'relationToFields[0]',
    foreignKey: 'relationFromFields[0]',
  });

  const modelMorphism = morphism<Schema<ModelProperties, DMMF.Model>>({
    name: 'name',
    dbName: 'dbName',
    scalarFields: {
      path: 'fields',
      fn: (fields: DMMF.Field[]) =>
        fields
          .filter((field) => ['scalar', 'enum'].includes(field.kind))
          .filter((field) => !['createdAt', 'updatedAt', 'deletedAt'].includes(field.name))
          .map(scalarMorphism),
    },
    belongsToFields: {
      path: 'fields',
      fn: (fields: DMMF.Field[]) =>
        fields
          .filter((field) => field.kind === 'object')
          .filter((field) => !field.isList && field.relationToFields?.length)
          .map(relationMorphism),
    },
    hasOneFields: {
      path: 'fields',
      fn: (fields: DMMF.Field[]) =>
        fields
          .filter((field) => field.kind === 'object')
          .filter((field) => !field.isList && !field.relationToFields?.length)
          .map(relationMorphism),
    },
    hasManyFields: {
      path: 'fields',
      fn: (fields: DMMF.Field[]) =>
        fields
          .filter((field) => field.kind === 'object')
          .filter((field) => field.isList)
          .map(relationMorphism),
    },
    hasCreatedAt: { path: 'fields', fn: compose(includes('createdAt'), map(prop('name'))) },
    hasUpdatedAt: { path: 'fields', fn: compose(includes('updatedAt'), map(prop('name'))) },
    hasDeletedAt: { path: 'fields', fn: compose(includes('deletedAt'), map(prop('name'))) },
  });

  const transformMorphism = morphism<Schema<{ models: ModelProperties[] }, DMMF.Datamodel>>({
    models: { path: 'models', fn: modelMorphism },
  });

  return transformMorphism(dmmf.datamodel);
}
