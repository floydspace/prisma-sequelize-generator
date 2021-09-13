export const PrismaTypeToSequelizeType: Record<string, string> = {
  Int: 'INTEGER',
  Float: 'FLOAT',
  Decimal: 'DECIMAL',
  String: 'STRING',
  Boolean: 'BOOLEAN',
  DateTime: 'DATE',
  Json: 'JSONB',
};
