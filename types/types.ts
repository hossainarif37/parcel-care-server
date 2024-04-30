// User Interface
export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'delivery man' | 'admin';
    profilePicture?: string;
}

