'use client';

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Ban, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminUserTable({ users }: { users: User[] }) {
    const { toast } = useToast();

    const handleAction = (action: string, userName: string) => {
        toast({ title: `${action} user: ${userName}`, description: 'This is a mock action.' });
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Followers</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                            </TableCell>
                            <TableCell>{user.followers}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleAction('View posts for', user.name)}><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleAction('Ban', user.name)}><Ban className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleAction('Delete', user.name)}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
