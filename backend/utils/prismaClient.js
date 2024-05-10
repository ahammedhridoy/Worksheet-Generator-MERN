const { PrismaClient } = require("@prisma/client");

/**
 * @type {PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>}
 */
let prisma;

if (!prisma) {
  prisma = new PrismaClient();
}

module.exports = prisma;
