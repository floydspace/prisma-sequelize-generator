## [1.0.0-beta.4](https://github.com/floydspace/prisma-sequelize-generator/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2021-09-14)


### Bug Fixes

* do not generate unnecessary code ([e5fe2ac](https://github.com/floydspace/prisma-sequelize-generator/commit/e5fe2ac787973dc99d18756cb9a9b3ae5e687cda))

## [1.0.0-beta.3](https://github.com/floydspace/prisma-sequelize-generator/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2021-09-11)


### Bug Fixes

* broken .env resolving ([93ff453](https://github.com/floydspace/prisma-sequelize-generator/commit/93ff45328479d4e998371a82cdef3ee46ff9c91f))

## [1.0.0-beta.2](https://github.com/floydspace/prisma-sequelize-generator/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2021-09-11)


### Bug Fixes

* bug in models associations, make factory synchronous, fix readme ([b8f4b2d](https://github.com/floydspace/prisma-sequelize-generator/commit/b8f4b2df687486ddfa429ade20df35121aa780b1))

## [1.0.0-beta.1](https://github.com/floydspace/prisma-sequelize-generator/compare/v1.0.0-alpha.3...v1.0.0-beta.1) (2021-09-11)


### Features

* accept sequelize options on create instance ([d509e78](https://github.com/floydspace/prisma-sequelize-generator/commit/d509e7867c26d2fbf5ad7eacdd5c5c8c85d5d8e3))
* cleanup generated file structure, improve model initialization ([f1b5730](https://github.com/floydspace/prisma-sequelize-generator/commit/f1b5730dd5e09695c7b6bfb15b93625ac6479271))
* support enums ([69e1d96](https://github.com/floydspace/prisma-sequelize-generator/commit/69e1d969016ff037152e5f611ba621ba73023c10))

## [1.0.0-alpha.3](https://github.com/floydspace/prisma-sequelize-generator/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2021-09-10)


### Features

* generate relation associations ([637e367](https://github.com/floydspace/prisma-sequelize-generator/commit/637e3672f28e9526ca9feaec1e631ae4e05560e5))
* support hasOne and hasMany relations ([8d63d3f](https://github.com/floydspace/prisma-sequelize-generator/commit/8d63d3f0fe527254e949a256eb3c0a0f451730cf))
* **generator:** generate primary key and timestamps and other field props properly ([23b1ece](https://github.com/floydspace/prisma-sequelize-generator/commit/23b1ece203e25de04d6823682d4c661b3e109709))


### Bug Fixes

* **env:** load and parse database url in runtime ([efe8b97](https://github.com/floydspace/prisma-sequelize-generator/commit/efe8b97a50c2235f9dda5fbecabf31bfa710d7f6))
* **sequelize:** no need to parse db url, sequelize accepts it ([7ed9a04](https://github.com/floydspace/prisma-sequelize-generator/commit/7ed9a04b2f6e0f7f34c11b430b77506a24db0d7d))

## [1.0.0-alpha.2](https://github.com/floydspace/prisma-sequelize-generator/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2021-08-17)


### Bug Fixes

* **release:** add missed scripts preparing build ([98f5fef](https://github.com/floydspace/prisma-sequelize-generator/commit/98f5fefaff0aed3b7be2d55794e5342f12692581))

## 1.0.0-alpha.1 (2021-08-17)


### Features

* implement basic generator ([87165fa](https://github.com/floydspace/prisma-sequelize-generator/commit/87165fab3f14b1461569faf1fe1b66554b4f2d19))


### Bug Fixes

* **ci:** do not run husky in ci ([f69abef](https://github.com/floydspace/prisma-sequelize-generator/commit/f69abefa4d8f2d7d1ac48c686318fb2c9dd17793))
