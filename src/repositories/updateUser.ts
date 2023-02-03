import { prisma } from "./prisma";

export function updateUser(
    id: string,
    email: string,
    name: string,
) {
    return prisma.user.update({
        where: {
            id
        },
        data: {
            email,
            name
        }
    })
}