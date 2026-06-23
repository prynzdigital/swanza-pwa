import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding service types...");

  await prisma.serviceType.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Standard Clean",
        description:
          "Regular maintenance clean covering all rooms. Ideal for weekly or bi-weekly upkeep. Includes dusting, vacuuming, mopping, kitchen surfaces, and bathroom sanitisation.",
        basePrice: 8900,
        durationHours: 2,
      },
      {
        name: "Deep Clean",
        description:
          "Thorough top-to-bottom clean for homes that need extra attention. Includes everything in Standard plus inside appliances, baseboards, window sills, light fixtures, and grout scrubbing.",
        basePrice: 17900,
        durationHours: 4,
      },
      {
        name: "Move-In / Move-Out Clean",
        description:
          "Comprehensive clean for vacant properties. Covers every surface inside and out including inside cabinets, oven, fridge, all fixtures, and walls. Landlord and tenant approved.",
        basePrice: 24900,
        durationHours: 6,
      },
    ],
  });

  const count = await prisma.serviceType.count();
  console.log(`Done — ${count} service types in database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
