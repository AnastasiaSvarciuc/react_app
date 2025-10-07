import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Pagination,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { mockData } from './mockData';
import type { Role, Group } from './types';

const getCategoryIcon = (category: Role['category']) => {
  switch (category) {
    case 'Admin': return <AdminIcon color="error" />;
    case 'Manager': return <SecurityIcon color="warning" />;
    case 'Developer': return <CodeIcon color="success" />;
    case 'Analyst': return <AnalyticsIcon color="info" />;
    default: return <PersonIcon color="action" />;
  }
};

const getCategoryColor = (category: Role['category']) => {
  switch (category) {
    case 'Admin': return 'error';
    case 'Manager': return 'warning';
    case 'Developer': return 'success';
    case 'Analyst': return 'info';
    default: return 'default';
  }
};

function App() {
  const [groups, setGroups] = useState<Group[]>(mockData.groups);
  const [roles] = useState<Role[]>(mockData.roles);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openNewGroupDialog, setOpenNewGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const itemsPerPage = 6;

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const filteredRoles = useMemo(() => {
    let filtered = [...roles];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchLower) ||
        role.description.toLowerCase().includes(searchLower) ||
        role.permissions.some(permission => permission.toLowerCase().includes(searchLower))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(role => role.category === categoryFilter);
    }

    if (selectedGroupId && tabValue !== 0) {
      const groupRoleIds = selectedGroup?.roleIds || [];
      filtered = filtered.filter(role => {
        const isAssigned = groupRoleIds.includes(role.id);
        return tabValue === 1 ? isAssigned : !isAssigned;
      });
    }

    return filtered;
  }, [roles, searchTerm, categoryFilter, selectedGroupId, selectedGroup, tabValue]);

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRoles, currentPage]);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const handleRoleToggle = (roleId: string) => {
    if (!selectedGroupId) return;

    setGroups(prev => prev.map(group => {
      if (group.id === selectedGroupId) {
        const roleIds = group.roleIds.includes(roleId)
          ? group.roleIds.filter(id => id !== roleId)
          : [...group.roleIds, roleId];
        return { ...group, roleIds };
      }
      return group;
    }));
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: `g${Date.now()}`,
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        roleIds: [],
        createdAt: new Date(),
      };
      setGroups(prev => [...prev, newGroup]);
      setNewGroupName('');
      setNewGroupDescription('');
      setOpenNewGroupDialog(false);
      setSelectedGroupId(newGroup.id);
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
    }
  };

  const getTabCounts = () => {
    if (!selectedGroup) return { all: roles.length, assigned: 0, unassigned: roles.length };

    const assigned = roles.filter(role => selectedGroup.roleIds.includes(role.id)).length;
    return {
      all: roles.length,
      assigned,
      unassigned: roles.length - assigned,
    };
  };

  const tabCounts = getTabCounts();

  return (
    <Grid container alignContent="space-between" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <GroupIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Groups & Roles Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Panel - Groups */}
          <Grid size={{ xs: 6, md: 8 }}>
            <Paper sx={{ p: 2, height: 'fit-content' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Groups</Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenNewGroupDialog(true)}
                >
                  New
                </Button>
              </Box>

              <List>
                {groups.map((group) => (
                  <ListItem
                    key={group.id}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={() => setSelectedGroupId(group.id)}
                        checked={selectedGroupId === group.id}
                      />
                    }
                  >
                    <ListItemText
                      primary={group.name}
                      secondary={`${group.roleIds.length} roles • ${group.description}`}
                    />

                    <Tooltip title="Delete group">
                      <Button
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Tooltip>

                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Role Management
              </Typography>

              {selectedGroup ? (
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Managing roles for: {selectedGroup.name}
                </Typography>
              ) : (
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Select a group to manage its roles
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2} sx={{xs: 12, mb: 3 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    placeholder="Search roles, permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      label="Category"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                      <MenuItem value="Developer">Developer</MenuItem>
                      <MenuItem value="Analyst">Analyst</MenuItem>
                      <MenuItem value="User">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {selectedGroup && (
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                  sx={{ mb: 2 }}
                >
                  <Tab label={`All Roles (${tabCounts.all})`} />
                  <Tab label={`Assigned (${tabCounts.assigned})`} />
                  <Tab label={`Unassigned (${tabCounts.unassigned})`} />
                </Tabs>
              )}

              <Grid container spacing={2}>
                {paginatedRoles.map((role) => {
                  const isAssigned = selectedGroup?.roleIds.includes(role.id) || false;

                  return (
                    <Grid size={{ xs: 6, md: 8 }}>
                      <Card
                        sx={{
                          height: '100%',
                          border: isAssigned ? 2 : 1,
                          borderColor: isAssigned ? 'primary.light' : 'grey.300',
                          bgcolor: isAssigned ? 'primary.light' : 'background.paper',
                          transition: 'all 0.2s',
                          '&:hover': { boxShadow: 3 },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'transparent' }}>
                              {getCategoryIcon(role.category)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" noWrap>
                                {role.name}
                              </Typography>
                              <Chip
                                label={role.category}
                                size="small"
                                color={getCategoryColor(role.category)}
                                variant="outlined"
                              />
                            </Box>
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {role.description}
                          </Typography>

                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Permissions:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {role.permissions.map((permission) => (
                              <Chip
                                key={permission}
                                label={permission}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            ))}
                          </Box>
                        </CardContent>

                        {selectedGroup && (
                          <CardActions>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isAssigned}
                                  onChange={() => handleRoleToggle(role.id)}
                                  color="primary"
                                />
                              }
                              label="Assign to Group"
                            />
                          </CardActions>
                        )}
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                  />
                </Box>
              )}

              {filteredRoles.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No roles match your filters
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openNewGroupDialog} onClose={() => setOpenNewGroupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            variant="outlined"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewGroupDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateGroup} variant="contained" disabled={!newGroupName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default App
