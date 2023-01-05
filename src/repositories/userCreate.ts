import { prisma } from "./prisma";

export async function createUser(name: string, email: string){
    return prisma.user.create({
        data: {
            email,
            name
        }
    })
}