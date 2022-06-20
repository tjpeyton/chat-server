export type Message = {
  owner: string;
  text: string;
  type: string;
  ownerId: string;
}

export type PrivateMessage = {
  type: string;
  fromId: string;
  fromName: string
  text: string;
  toId: string
}

export type NameChange = {
  name: string,
  ownerColor: string
}
