import { users } from "./users";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    for (let user of users) {
        const createdUser = await prisma.user.create({
            data: user
        });

        if(createdUser) {
            await prisma.balance.create({
                data: {
                    userId: createdUser.id,
                    balance: 0
                }
            })
        }
    }
}

main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally(() => {
    prisma.$disconnect();
})