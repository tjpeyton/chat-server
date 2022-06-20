export declare type Message = {
    owner: string;
    text: string;
    type: string;
    ownerId: string;
};
export declare type PrivateMessage = {
    type: string;
    fromId: string;
    fromName: string;
    text: string;
    toId: string;
};
export declare type NameChange = {
    name: string;
    ownerColor: string;
};
