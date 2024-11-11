export interface Notice {
    title: string;
    content: string;
}

export interface ReceivedNotice extends Notice {
    id: number;
    postedadmin: string;
    createdAt: string;
}

export interface Post {
    title: string;
    content: string; 
}

export interface Comment {
    id: number;
    content: string;
    posteduser: string;
    createdAt: string;
}

export interface ReceivedPost extends Post {
    id: number;
    posteduser: string;
    createdAt: string;
    comments: Comment[];
}