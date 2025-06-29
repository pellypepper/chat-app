export declare function findUserById(id: number): Promise<{
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    verified: boolean | null;
    createdAt: Date | null;
    profilePicture: string | null;
    bio: string | null;
}>;
