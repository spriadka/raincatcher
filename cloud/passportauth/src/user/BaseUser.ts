export interface BaseUser {
  id: string;
  username: string;
  password: string;
  roles: string[];
}

export default BaseUser;