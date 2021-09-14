import { morphism, Schema, createSchema } from 'morphism';
import R from 'ramda';

import { included, isNotEmpty, notIncluded } from './helpers';
import { ModelProperties, PrismaTypeToSequelizeType, RelationProperties, ScalarProperties } from './properties';

import type { DMMF } from '@prisma/generator-helper';

export function transformDMMF(dmmf: DMMF.Document) {
  const enumIndex = R.indexBy(R.prop('name'), dmmf.datamodel.enums ?? []);
  const enumValuesToString = (e: DMMF.DatamodelEnum) =>
    `ENUM(${e.values
      .map(R.prop('name'))
      .map((n) => `'${n}'`)
      .join(', ')})`;

  const scalarSchema = createSchema<ScalarProperties, DMMF.Field>(
    {
      isList: 'isList',
      hasDefaultValue: 'hasDefaultValue',
      default: 'default',
      isId: 'isId',
      isUnique: 'isUnique',
      fieldName: 'name',
      type: (field: DMMF.Field) =>
        field.kind === 'scalar'
          ? R.prop(field.type, PrismaTypeToSequelizeType)
          : enumValuesToString(R.prop(field.type, enumIndex)),
      allowNull: { path: 'isRequired', fn: R.not },
      isAutoincrement: R.allPass([R.prop('hasDefaultValue'), R.pathEq(['default', 'name'], 'autoincrement')]),
    },
    { undefinedValues: { strip: true } }
  );

  const relationMorphism = morphism<Schema<RelationProperties, DMMF.Field>>({
    as: 'name',
    name: 'type',
    targetKey: 'relationToFields[0]',
    foreignKey: 'relationFromFields[0]',
  });

  const modelMorphism = morphism<Schema<ModelProperties, DMMF.Model>>({
    modelName: 'name',
    dbName: 'dbName',
    scalarFields: {
      path: 'fields',
      fn: (fields: DMMF.Field[]) =>
        R.filter(
          R.allPass([
            R.propSatisfies(included(['scalar', 'enum']), 'kind'),
            R.propSatisfies(notIncluded(['createdAt', 'updatedAt', 'deletedAt']), 'name'),
          ]),
          fields
        ).map(morphism(scalarSchema)),
    },
    belongsToFields: {
      path: 'fields',
      fn: (fields: DMMF.Field[]) =>
        R.filter(
          R.allPass([
            R.propEq('kind', 'object'),
            R.propSatisfies(R.not, 'isList'),
            R.propSatisfies(isNotEmpty, 'relationToFields'),
          ]),
          fields
        ).map(relationMorphism),
    },
    hasOneFields: {
      path: 'fields',
      fn: (fields: DMMF.Field[]) =>
        R.filter(
          R.allPass([
            R.propEq('kind', 'object'),
            R.propSatisfies(R.not, 'isList'),
            R.propSatisfies(R.isEmpty, 'relationToFields'),
          ]),
          fields
        ).map(relationMorphism),
    },
    hasManyFields: {
      path: 'fields',
      fn: (fields: DMMF.Field[]) =>
        R.filter(R.allPass([R.propEq('kind', 'object'), R.prop('isList')]), fields).map(relationMorphism),
    },
    hasCreatedAt: { path: 'fields', fn: R.compose(R.includes('createdAt'), R.map(R.prop('name'))) },
    hasUpdatedAt: { path: 'fields', fn: R.compose(R.includes('updatedAt'), R.map(R.prop('name'))) },
    hasDeletedAt: { path: 'fields', fn: R.compose(R.includes('deletedAt'), R.map(R.prop('name'))) },
  });

  const transformMorphism = morphism<Schema<{ models: ModelProperties[] }, DMMF.Datamodel>>({
    models: { path: 'models', fn: modelMorphism },
  });

  return transformMorphism(dmmf.datamodel);
}
