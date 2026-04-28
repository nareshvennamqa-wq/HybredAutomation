type UserStatus = 'active' | 'inactive';
type UserRole = 'user' | 'admin';

type DbUser = {
  email: string;
  name: string;
  password: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
};

function createSeedUsers(): DbUser[] {
  const loginEmail = process.env.LOGIN_EMAIL ?? 'user@example.com';
  const loginPassword = process.env.LOGIN_PASSWORD ?? 'Password123!';

  return [
    {
      email: loginEmail,
      name: 'Naresh Reddy',
      password: loginPassword,
      status: 'active',
      role: 'user',
      createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
    },
  ];
}

export class DbHelper {
  private usersTable: DbUser[];

  constructor(seedUsers: DbUser[] = createSeedUsers()) {
    this.usersTable = [...seedUsers];
  }

  getUserByEmail(email: string) {
    return this.usersTable.find((user) => user.email === email);
  }

  isUserActive(email: string) {
    return this.getUserByEmail(email)?.status === 'active';
  }

  isValidCredentials(email: string, password: string) {
    const user = this.getUserByEmail(email);
    return user?.password === password;
  }

  userExists(email: string) {
    return Boolean(this.getUserByEmail(email));
  }

  insertUser(user: DbUser) {
    if (this.userExists(user.email)) {
      throw new Error(`User with email ${user.email} already exists`);
    }

    this.usersTable.push(user);
    return user;
  }

  deleteUser(email: string) {
    const initialLength = this.usersTable.length;
    this.usersTable = this.usersTable.filter((user) => user.email !== email);
    return this.usersTable.length < initialLength;
  }

  updateUserStatus(email: string, status: UserStatus) {
    const user = this.getUserByEmail(email);

    if (!user) {
      return false;
    }

    user.status = status;
    return true;
  }
}

export function getUserFromDB(email: string) {
  return new DbHelper().getUserByEmail(email);
}
