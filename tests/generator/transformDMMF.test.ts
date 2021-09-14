import { getDMMF } from '@prisma/sdk';
import { PrismaTypeToSequelizeType } from '../../src/generator/properties';

import { transformDMMF } from '../../src/generator/transformDMMF';

describe('given transformDMMF,', () => {
  it('should transform properly.', async () => {
    expect.assertions(1);

    const datamodel = `
      model User {
        id String @id
      }
    `;
    const expectedProperties = {
      models: [
        {
          modelName: 'User',
          dbName: null,
          scalarFields: [
            {
              fieldName: 'id',
              allowNull: false,
              hasDefaultValue: false,
              isAutoincrement: false,
              isId: true,
              isList: false,
              isUnique: false,
              type: PrismaTypeToSequelizeType.String,
            },
          ],
          belongsToFields: [],
          hasManyFields: [],
          hasOneFields: [],
          hasCreatedAt: false,
          hasUpdatedAt: false,
          hasDeletedAt: false,
        },
      ],
    };

    const dmmf = await getDMMF({ datamodel });
    const result = transformDMMF(dmmf);

    expect(result).toStrictEqual(expectedProperties);
  });
});
