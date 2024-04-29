// User Interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'delivery man' | 'admin';
    profilePicture?: string;
}

