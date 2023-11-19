export type User = {
  id?: number;
  nickname: string;
  email: string;
  editingInProgress?: boolean;
};

export function createEmptyUser(nickname = '', email = ''): User {
  return { nickname, email };
}

export function createUser(nickname: string, email: string): User {
  return {
    nickname,
    email,
    id: Date.now() + Math.round(Math.random() * 10),
    editingInProgress: false,
  };
}
