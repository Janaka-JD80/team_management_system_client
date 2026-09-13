import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { rolesApi } from '@/api/roles';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon, ShieldAlert } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function UsersTab() {
  const queryClient = useQueryClient();
  const [isManageRolesOpen, setIsManageRolesOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAllUsers,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: rolesApi.getAllRoles,
  });

  const assignRolesMutation = useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string, roleIds: string[] }) => usersApi.assignRoles(userId, { role_ids: roleIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsManageRolesOpen(false);
    }
  });

  const openManageRoles = (user: any) => {
    setSelectedUser(user);
    setSelectedRoleIds(user.roles.map((r: any) => r.role_id));
    setIsManageRolesOpen(true);
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSaveRoles = () => {
    if (selectedUser) {
      assignRolesMutation.mutate({ userId: selectedUser.user_id, roleIds: selectedRoleIds });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-primary" /> Manage Users
        </CardTitle>
        <CardDescription>View system users and manage their role assignments.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8 text-muted-foreground animate-pulse">Loading users...</div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Roles</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell className="font-medium">{u.full_name || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{u.user_email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <Badge key={r.role_id} variant="secondary" className="font-normal text-xs">
                            {r.role_name}
                          </Badge>
                        ))}
                        {u.roles.length === 0 && <span className="text-xs text-muted-foreground">No roles</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openManageRoles(u)}>
                        <ShieldAlert className="w-4 h-4 mr-2" /> Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isManageRolesOpen} onOpenChange={setIsManageRolesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Roles for {selectedUser?.full_name || selectedUser?.user_email}</DialogTitle>
            <DialogDescription>Assign or remove access roles for this user.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {roles.map(role => (
              <div key={role.role_id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id={`role-${role.role_id}`} 
                  checked={selectedRoleIds.includes(role.role_id)}
                  onCheckedChange={() => toggleRole(role.role_id)}
                />
                <div className="flex flex-col cursor-pointer" onClick={() => toggleRole(role.role_id)}>
                  <Label htmlFor={`role-${role.role_id}`} className="font-medium cursor-pointer">{role.role_name}</Label>
                  {role.role_description && (
                    <span className="text-xs text-muted-foreground">{role.role_description}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageRolesOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRoles} disabled={assignRolesMutation.isPending}>
              {assignRolesMutation.isPending ? 'Saving...' : 'Save Roles'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
