[![Actions Status](https://github.com/floydspace/prisma-sequelize-generator/workflows/build/badge.svg)](https://github.com/floydspace/prisma-sequelize-generator/actions)
[![Code QL](https://github.com/floydspace/prisma-sequelize-generator/workflows/CodeQL/badge.svg)](https://github.com/floydspace/prisma-sequelize-generator/workflows/CodeQL/badge.svg)
[![npm](https://img.shields.io/npm/v/prisma-sequelize-generator)](https://www.npmjs.com/package/prisma-sequelize-generator)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/floydspace/prisma-sequelize-generator/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/Naereen/badges/)

# Prisma Sequelize Generator

A generator, which takes a Prisma 2 `schema.prisma` and generates Sequelize Models.

## Getting Started

**1. Install**

npm:

```shell
npm install prisma-sequelize-generator --save-dev
```

yarn:

```shell
yarn add -D prisma-sequelize-generator
```

**2. Add the generator to the schema**

```prisma
generator client {
  provider = "prisma-sequelize-generator"
}
```

With a custom output path (default=./models)

```prisma
generator client {
  provider = "prisma-sequelize-generator"
  output = "custom-output-path"
}
```

**3. Run generation**

prisma:

```shell
prisma generate
```

## Supported Node Versions

|         Node Version | Support            |
| -------------------: | :----------------- |
| (Maintenance LTS) 12 | :heavy_check_mark: |
|      (Active LTS) 14 | :heavy_check_mark: |
|         (Current) 16 | :heavy_check_mark: |
