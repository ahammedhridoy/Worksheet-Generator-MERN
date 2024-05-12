import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContext, useEffect } from "react";
import { AuthContext } from "./../../context/authcontext";
import apiRequest from "./../../Config/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AllUser = () => {
  const { token, users, user, fetchUsers } = useContext(AuthContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user || (user && user.role !== "ADMIN") || !token) {
      navigate("/");
    }
  }, [user, token]);

  //   Delete User
  const deleteUser = async (userId) => {
    try {
      const { data } = await apiRequest.delete(`/users/${userId}`);
      toast.success(data.message);
      fetchUsers();
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="p-4 all-user w-[100%]">
      <Table>
        <TableCaption>All User List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        {users?.map((user) => (
          <TableBody key={user?.id}>
            <TableRow>
              <TableCell className="font-medium">{user?.username}</TableCell>
              <TableCell>{user?.email}</TableCell>
              <TableCell>{user?.role}</TableCell>
              <TableCell className="text-right">
                {/* AlertDialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure want to delete?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteUser(user?.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </div>
  );
};

export default AllUser;
