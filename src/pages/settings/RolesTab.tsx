import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '@/api/roles';
import { permissionsApi } from '@/api/permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Plus, Trash2, Key } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function RolesTab() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isManagePermsOpen, setIsManagePermsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: rolesApi.getAllRoles,
  });

  const { data: permissions = [], isLoading: permsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionsApi.getAllPermissions,
  });

  const createMutation = useMutation({
    mutationFn: (data: { role_name: string, role_description?: string }) => rolesApi.createRole(data.role_name, data.role_description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsCreateOpen(false);
      setFormData({ name: '', description: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: rolesApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });

  const assignPermsMutation = useMutation({
    mutationFn: ({ roleId, permIds }: { roleId: string, permIds: string[] }) => rolesApi.assignPermissions(roleId, { permission_ids: permIds }),
    onSuccess: () => {
      // Invalidate the specific role if we were storing it, or just close
      setIsManagePermsOpen(false);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ 
      role_name: formData.name, 
      role_description: formData.description || undefined 
    });
  };

  const openManagePerms = async (role: any) => {
    setSelectedRole(role);
    setIsManagePermsOpen(true);
    // Fetch current permissions for this role
    try {
      const fullRole = await rolesApi.getRole(role.role_id);
      setSelectedPermIds(fullRole.permissions.map((p: any) => p.permission_id));
    } catch (e) {
      console.error('Failed to load role permissions', e);
      setSelectedPermIds([]);
    }
  };

  const togglePerm = (permId: string) => {
    setSelectedPermIds(prev => 
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  const handleSavePerms = () => {
    if (selectedRole) {
      assignPermsMutation.mutate({ roleId: selectedRole.role_id, permIds: selectedPermIds });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Manage Roles
          </CardTitle>
          <CardDescription>Create roles and manage their system permissions.</CardDescription>
        </div>
        <Button onClick={() => {
          setFormData({ name: '', description: '' });
          setIsCreateOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Add Role
        </Button>
      </CardHeader>
      <CardContent>
        {rolesLoading ? (
          <div className="flex justify-center p-8 text-muted-foreground animate-pulse">Loading roles...</div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((r) => (
                  <TableRow key={r.role_id}>
                    <TableCell className="font-medium">{r.role_name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.role_description || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openManagePerms(r)}>
                          <Key className="w-4 h-4 mr-2" /> Perms
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(r.role_id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Create a new access role.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input id="role-name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-desc">Description (Optional)</Label>
                <Textarea id="role-desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving...' : 'Save Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isManagePermsOpen} onOpenChange={setIsManagePermsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Permissions for {selectedRole?.role_name}</DialogTitle>
            <DialogDescription>Select the permissions granted to this role.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {permsLoading ? (
              <div className="text-center text-sm text-muted-foreground animate-pulse">Loading permissions...</div>
            ) : (
              permissions.map(perm => (
                <div key={perm.permission_id} className="flex items-start space-x-3 border p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id={`perm-${perm.permission_id}`} 
                    checked={selectedPermIds.includes(perm.permission_id)}
                    onCheckedChange={() => togglePerm(perm.permission_id)}
                    className="mt-1"
                  />
                  <div className="flex flex-col cursor-pointer" onClick={() => togglePerm(perm.permission_id)}>
                    <Label htmlFor={`perm-${perm.permission_id}`} className="font-medium cursor-pointer">{perm.permission_name}</Label>
                    {perm.permission_description && (
                      <span className="text-xs text-muted-foreground mt-1 leading-snug">{perm.permission_description}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter className="sticky bottom-0 bg-background pt-2 border-t">
            <Button variant="outline" onClick={() => setIsManagePermsOpen(false)}>Cancel</Button>
            <Button className='mb-3' onClick={handleSavePerms} disabled={assignPermsMutation.isPending}>
              {assignPermsMutation.isPending ? 'Saving...' : 'Save Permissions'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
