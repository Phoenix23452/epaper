"use client";
import { useState, useEffect } from "react";
import AdminContainer from "@/components/admin/AdminContainer";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type User = {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR";
  createdAt: string;
};

type EditUser = User & { password?: string };

export default function UsersPage() {
  const { data: session, update } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    password: "",
    role: "ADMIN" as "ADMIN" | "EDITOR",
  });
  const [editUser, setEditUser] = useState<EditUser | null>(null);

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    const response = await fetch("/api/auth/users");
    if (response.ok) {
      const data = await response.json();
      // Sort to place current user at the top
      const sortedUsers = data.sort((a: User, b: User) =>
        a.id === Number(session?.user.id)
          ? -1
          : b.id === Number(session?.user.id)
            ? 1
            : 0,
      );
      setUsers(sortedUsers);
    } else {
      toast.error("Failed to fetch users");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/auth/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (response.ok) {
      toast("User added successfully");
      setNewUser({ email: "", name: "", password: "", role: "ADMIN" });
      fetchUsers();
    } else {
      const error = await response.json();
      toast.error(error.error);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser || !session) return;
    const response = await fetch("/api/auth/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: editUser.email,
        name: editUser.name,
        password: editUser.password || undefined,
        role: editUser.role,
      }),
    });
    if (response.ok) {
      toast("User updated successfully");
      setEditUser(null);
      fetchUsers();
      // Update session if current user's email changed
      if (
        editUser.id === Number(session.user.id) &&
        editUser.email !== session.user.email
      ) {
        await update({ email: editUser.email });
      }
    } else {
      const error = await response.json();
      toast.error(error.error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const response = await fetch(`/api/auth/users/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast("User deleted successfully");
      fetchUsers();
    } else {
      const error = await response.json();
      toast.error(error.error);
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <AdminContainer heading="Users">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add New User Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-password">Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({
                      ...newUser,
                      role: value as "ADMIN" | "EDITOR",
                    })
                  }
                >
                  <SelectTrigger id="new-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="EDITOR">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Add User</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {editUser && (
              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editUser.name}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-password">
                    New Password (leave blank to keep current)
                  </Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={editUser.password || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editUser.role}
                    onValueChange={(value) =>
                      setEditUser({
                        ...editUser,
                        role: value as "ADMIN" | "EDITOR",
                      })
                    }
                    disabled={session.user.role !== "ADMIN"}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Update User</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Users Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.name}
                  {user.id === Number(session.user.id) && (
                    <Badge className="ml-2 bg-green-500">Current</Badge>
                  )}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditUser({ ...user, password: "" })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={user.id === Number(session.user.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the user {user.email}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </AdminContainer>
  );
}
