import { getGenerator } from '@prisma/sdk';
import temp from 'temp';
import path from 'path';
import fs from 'fs';

describe('given prisma-sequelize-generator,', () => {
  beforeAll(() => {
    temp.track();
  });

  afterAll(() => {
    temp.cleanupSync();
  });

  it('should generate models.', async () => {
    expect.hasAssertions();

    const mockDir = temp.mkdirSync({ dir: path.join(__dirname, '../.testArtifacts') });

    const generator = await getGenerator({
      schemaPath: path.join(__dirname, '../prisma/schema.prisma'),
      baseDir: mockDir,
      printDownloadProgress: false,
      skipDownload: true,
    });

    await generator.generate();

    const expectedDir = path.join(mockDir, 'sequelize');
    expect(fs.existsSync(expectedDir)).toBe(true);
    expect(fs.existsSync(path.join(expectedDir, 'index.ts'))).toBe(true);
    expect(fs.existsSync(path.join(expectedDir, 'config.json'))).toBe(true);
    expect(fs.existsSync(path.join(expectedDir, 'models', 'index.ts'))).toBe(true);
    expect(fs.existsSync(path.join(expectedDir, 'models', 'Post.ts'))).toBe(true);
    expect(fs.existsSync(path.join(expectedDir, 'models', 'User.ts'))).toBe(true);
    expect(fs.existsSync(path.join(expectedDir, 'utils', 'index.ts'))).toBe(true);
    expect(fs.existsSync(path.join(expectedDir, 'utils', 'find.ts'))).toBe(true);

    generator.stop();
  });
});
