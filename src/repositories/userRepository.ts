import { prisma } from './prisma';


export function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email
        }
    })
}
export function findUserById(id: string) {
    if (!id) {
        return null
    }
    return prisma.user.findUnique({
        where: {
            id
        }
    })
}

export async function createUser(email: string, name: string) {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return null
    }
    return prisma.user.create({
        data: {
            email,
            name
        }
    })
}

export function updateUser(id: string, email: string, name: string) {
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

export function deleteUser(id: string) {
    return prisma.user.delete({
        where: {
            id
        }
    })
}

export function createPost(content: string, userId: string) {
    return prisma.post.create({
        data: {
            content,
            userId,
        },
    });
}

export function findPosts() {

    return prisma.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

export function createPostImage(image: string, userId: string) {
    return prisma.post.create({
        data: {
            content: "",
            image,
            userId,
        },
    });
}