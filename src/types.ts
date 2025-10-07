export interface Role {
  id: string;
  name: string;
  description: string;
  category: 'Admin' | 'Manager' | 'Developer' | 'Analyst' | 'User';
  permissions: string[];
  isRequired?: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  roleIds: string[];
  createdAt: Date;
}

export interface MockData {
  roles: Role[];
  groups: Group[];
}