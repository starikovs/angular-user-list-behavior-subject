export type User = {
  id?: number;
  nickname: string;
  editingInProgress?: boolean;
};

export function createEmptyUser(nickname: string = ""): User {
  return { nickname };
}

export function createUser(nickname: string): User {
  return {
    nickname,
    id: Date.now() + Math.round(Math.random() * 10),
    editingInProgress: false,
  };
}
