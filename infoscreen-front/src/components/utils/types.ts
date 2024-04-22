export interface Comment {
    id: string;
    text: string;
    author: string;
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
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;

}
