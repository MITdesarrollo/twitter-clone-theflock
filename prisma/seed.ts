import { prisma } from '../src/infra/prisma/client';

async function main() {
  console.log('Seeding database...');
  console.log('Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
