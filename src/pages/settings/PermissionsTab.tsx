import { useQuery } from '@tanstack/react-query';
import { permissionsApi } from '@/api/permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Key } from 'lucide-react';

export function PermissionsTab() {
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionsApi.getAllPermissions,
  });

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" /> View Permissions
        </CardTitle>
        <CardDescription>A read-only list of all system permissions available for roles.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8 text-muted-foreground animate-pulse">Loading permissions...</div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((p) => (
                  <TableRow key={p.permission_id}>
                    <TableCell className="font-medium font-mono text-xs">{p.permission_name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.permission_description || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
