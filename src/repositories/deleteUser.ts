import { prisma } from "./prisma";

export function deleteUser(id: string) {
    return prisma.user.delete({
        where: {
            id
        }
    })
}