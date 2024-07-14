export interface Comment {
    id: string;
    text: string;
    author: CommentUser;
    created: string;
    edited: boolean; // Add this line
    lastEdited: string; // Add this line
}
export interface Task {
    _id: { $oid: string };
    id: string;
    manager: User;
    subject: string;
    dueBy: string;
    description: string;
    assignedTo: User;
    status: string;
    comments: Comment[];
    imageUrl: string;
    state: string;
    createdDate: any;
    completedDate: any;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    birthdate: string;
    imageUrl: string;
    coffee: number;
    soda: number;
    email?: string;
    password?: string;
    refreshToken?: string;
}

export interface CommentUser {
    firstName: string;
    lastName: string;
    id: string;

}

export interface Column {
    id: string;
    order: number;
    title: string;
    tasks: Task[];
}

export interface Role {
    _id: string;
    name: string;
    description?: string; // Optional description property
    settings?: any; // Replace 'any' with the actual type of your settings
}