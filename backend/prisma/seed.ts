import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // 1. Users
    await prisma.user.createMany({
        data: [
            { email: "admin@gmail.com", username: "Admin", password: "$2a$10$Yw1KKxW0PnVFXRZLGcKFxOk1uDwk6PbuARuh9BO28ZoD3wsz4L8WO" },
        ],
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
