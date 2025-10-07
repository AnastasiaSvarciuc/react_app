import type { MockData } from './types';

export const mockData: MockData = {
  roles: [
    {
      id: '1',
      name: 'System Administrator',
      description: 'Full system access and management capabilities',
      category: 'Admin',
      permissions: ['read', 'write', 'delete', 'manage_users', 'system_config'],
    },
    {
      id: '2',
      name: 'Project Manager',
      description: 'Project coordination and team management',
      category: 'Manager',
      permissions: ['read', 'write', 'manage_projects', 'team_lead'],
    },
    {
      id: '3',
      name: 'Senior Developer',
      description: 'Advanced development access with architecture permissions',
      category: 'Developer',
      permissions: ['read', 'write', 'deploy', 'debug', 'architecture'],
    },
    {
      id: '4',
      name: 'Data Analyst',
      description: 'Data analysis and reporting capabilities',
      category: 'Analyst',
      permissions: ['read', 'analyze', 'report'],
    },
    {
      id: '5',
      name: 'Basic User',
      description: 'Standard user access for daily operations',
      category: 'User',
      permissions: ['read'],
    },
    {
      id: '6',
      name: 'Developer',
      description: 'Code development and testing access',
      category: 'Developer',
      permissions: ['read', 'write', 'deploy', 'debug'],
    },
    {
      id: '7',
      name: 'Content Manager',
      description: 'Content creation and editing permissions',
      category: 'Manager',
      permissions: ['read', 'write', 'edit_content', 'publish'],
    },
    {
      id: '8',
      name: 'Security Auditor',
      description: 'Security monitoring and audit capabilities',
      category: 'Admin',
      permissions: ['read', 'audit', 'security_monitor'],
    },
  ],
  groups: [
    {
      id: 'g1',
      name: 'Development Team',
      description: 'Core development team with code access',
      roleIds: ['3', '6'],
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'g2',
      name: 'Admin Group',
      description: 'System administrators with full access',
      roleIds: ['1', '8'],
      createdAt: new Date('2024-01-16'),
    },
    {
      id: 'g3',
      name: 'Content Team',
      description: 'Content creators and managers',
      roleIds: ['5', '7'],
      createdAt: new Date('2024-01-17'),
    },
  ],
};