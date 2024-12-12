import { useState, useEffect } from "react";
import { Table, Modal, Label, TextInput, Button } from "flowbite-react";
import { Dropdown } from "flowbite-react";
import { Clock8 } from "lucide-react";

import {
  createUser,
  deleteUserById,
  getAllUsers,
  updateUserById,
} from "../../data/users";
import { getAllUserRoles, getUserRoleById } from "../../data/userRoles";
import Search from "../../components/Search";
import toast from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  function onCloseCreateModal() {
    setOpenCreateModal(false);
  }

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      const updatedUsers = await Promise.all(
        fetchedUsers.map(async (user) => {
          const userRole = await getUserRoleById(user.roleId);
          return {
            ...user,
            role: userRole.roleName,
          };
        })
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const fetchedUserRoles = await getAllUserRoles();
        setUserRoles(fetchedUserRoles);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };

    fetchUsers();
    fetchUserRoles();
  }, []);

  const handleCreateUser = async () => {
    try {
      console.log({ email, fullName, phone, password, userRole });
      const createdUser = await createUser(
        email,
        fullName,
        phone,
        password,
        userRole
      );
      toast.success("Tạo người dùng thành công", { duration: 2000 });
      setUsers([...users, createdUser]);
      setEmail("");
      setFullName("");
      setPhone("");
      setPassword("");
      setUserRole("");
      setOpenCreateModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Tạo người dùng thất bại:" + error.response.data.message, {
        duration: 2000,
      });
    }
  };

  const handleUpdateUser = async () => {
    const response = await updateUserById(
      userDetails._id,
      userDetails.fullName,
      userDetails.phone,
      userDetails.roleId
    );
    if (response) {
      toast.success("Cập nhật người dùng thành công", { duration: 2000 });
      fetchUsers();
      setOpenUpdateModal(false);
    } else {
      toast.error("Cập nhật người dùng thất bại", {
        duration: 2000,
      });
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUserById(id);
      setUsers(users.filter((user) => user._id !== id));
      toast.success("Xóa người dùng thành công", { duration: 2000 });
    } catch (error) {
      console.log(error);
      toast.error("Xóa người dùng thất bại", {
        duration: 2000,
      });
    }
  };

  return (
    <>
      <div className="p-10 w-full">
        <p className="font-extrabold text-xl">Người dùng</p>
        <div className="bg-white rounded-lg mt-10 p-6 shadow-md flex flex-col">
          <div className="overflow-x-auto">
            <div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
              <Search />
            </div>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head className="normal-case text-base">
                  <Table.HeadCell>Mã người dùng</Table.HeadCell>
                  <Table.HeadCell>Họ và tên</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Số điện thoại</Table.HeadCell>
                  <Table.HeadCell>Vai trò</Table.HeadCell>
                  <Table.HeadCell>Thao tác</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {users.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {user._id}
                      </Table.Cell>
                      <Table.Cell>{user.fullName}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{user.phone}</Table.Cell>
                      <Table.Cell>{user.role}</Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-row gap-x-3">
                          <button
                            className="font-medium hover:underline"
                            onClick={() => {
                              setUserDetails(user);
                              setOpenDetailModal(true);
                            }}
                          >
                            <div className="flex flex-row gap-x-1 items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                class="size-5"
                              >
                                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                <path
                                  fill-rule="evenodd"
                                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              <p className="text-[#0A0A0A]">Xem</p>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setUserDetails(user);
                              setOpenUpdateModal(true);
                            }}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            <div className="flex flex-row gap-x-1 items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14.4873 1.5127C14.1591 1.18458 13.7141 1.00024 13.25 1.00024C12.7859 1.00024 12.3408 1.18458 12.0127 1.5127L11.2413 2.28404L13.716 4.7587L14.4873 3.98737C14.8154 3.65919 14.9998 3.21412 14.9998 2.75004C14.9998 2.28596 14.8154 1.84088 14.4873 1.5127ZM13.0087 5.46604L10.534 2.99137L4.93399 8.59137C4.52255 9.0026 4.2201 9.50989 4.05399 10.0674L3.52065 11.8574C3.4949 11.9437 3.49298 12.0355 3.5151 12.1229C3.53721 12.2102 3.58253 12.29 3.64626 12.3538C3.71 12.4175 3.78978 12.4628 3.87716 12.4849C3.96454 12.507 4.05627 12.5051 4.14265 12.4794L5.93265 11.946C6.49014 11.7799 6.99743 11.4775 7.40865 11.066L13.0087 5.46604Z"
                                  fill="#475BE8"
                                />
                                <path
                                  d="M3.5 3.5C2.96957 3.5 2.46086 3.71071 2.08579 4.08579C1.71071 4.46086 1.5 4.96957 1.5 5.5V12.5C1.5 13.0304 1.71071 13.5391 2.08579 13.9142C2.46086 14.2893 2.96957 14.5 3.5 14.5H10.5C11.0304 14.5 11.5391 14.2893 11.9142 13.9142C12.2893 13.5391 12.5 13.0304 12.5 12.5V9C12.5 8.86739 12.4473 8.74022 12.3536 8.64645C12.2598 8.55268 12.1326 8.5 12 8.5C11.8674 8.5 11.7402 8.55268 11.6464 8.64645C11.5527 8.74022 11.5 8.86739 11.5 9V12.5C11.5 12.7652 11.3946 13.0196 11.2071 13.2071C11.0196 13.3946 10.7652 13.5 10.5 13.5H3.5C3.23478 13.5 2.98043 13.3946 2.79289 13.2071C2.60536 13.0196 2.5 12.7652 2.5 12.5V5.5C2.5 5.23478 2.60536 4.98043 2.79289 4.79289C2.98043 4.60536 3.23478 4.5 3.5 4.5H7C7.13261 4.5 7.25979 4.44732 7.35355 4.35355C7.44732 4.25979 7.5 4.13261 7.5 4C7.5 3.86739 7.44732 3.74021 7.35355 3.64645C7.25979 3.55268 7.13261 3.5 7 3.5H3.5Z"
                                  fill="#475BE8"
                                />
                              </svg>
                              <p className="text-blue-600">Sửa</p>
                            </div>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="font-medium text-[#EF0606] hover:underline"
                          >
                            <div className="flex flex-row gap-x-1 items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#EF0606"
                                class="size-5"
                              >
                                <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                                <path
                                  fill-rule="evenodd"
                                  d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              <p className="text-[#EF0606]">Lưu trữ</p>
                            </div>
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
        <button
          className="px-6 py-2 rounded bg-[#0A0A0A] text-white font-extrabold mt-10"
          onClick={() => setOpenCreateModal(true)}
        >
          Thêm người dùng mới
        </button>
      </div>
      <Modal
        show={openCreateModal}
        size="lg"
        onClose={onCloseCreateModal}
        popup
      >
        <Modal.Header />
        <Modal.Body className="px-10">
          <div className="space-y-4">
            <h3 className="text-xl text-center text-gray-900 dark:text-white font-manrope font-extrabold">
              Người dùng / Thêm mới
            </h3>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Email <b className="text-[#EF0606]">*</b>
              </p>
              <input
                id="email"
                value={email}
                className="w-full px-5 font-semibold font-manrope py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Họ và tên <b className="text-[#EF0606]">*</b>
              </p>
              <input
                id="fullName"
                value={fullName}
                className="w-full px-5 font-semibold font-manrope py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Số điện thoại <b className="text-[#EF0606]">*</b>
              </p>
              <input
                id="phone"
                value={phone}
                className="w-full px-5 font-semibold font-manrope py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Mật khẩu <b className="text-[#EF0606]">*</b>
              </p>
              <input
                id="password"
                type="password"
                value={password}
                className="w-full px-5 font-semibold font-manrope py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Vai trò <b className="text-[#EF0606]">*</b>
              </p>
              <select
                id="role"
                value={userRole}
                className="w-full px-5 font-semibold font-manrope py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) => setUserRole(e.target.value)}
                required
              >
                <option value="" className="font-medium font-manrope">
                  Chọn vai trò
                </option>
                {userRoles.map((role) => (
                  <option
                    key={role._id}
                    value={role.roleName}
                    className="font-medium font-manrope"
                  >
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex justify-center">
              <button
                className="px-6 py-2 rounded bg-[#0A0A0A] text-white font-extrabold mt-6 font-manrope"
                onClick={handleCreateUser}
              >
                Thêm người dùng
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={openDetailModal}
        size="lg"
        onClose={() => {
          setOpenDetailModal(false);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body className="px-10 pb-10">
          <div className="space-y-4">
            <h3 className="text-xl text-center text-gray-900 dark:text-white font-manrope font-extrabold">
              Người dùng / Chi tiết
            </h3>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">Email</p>
              <input
                value={userDetails.email}
                className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                disabled
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">Họ và tên</p>
              <input
                value={userDetails.fullName}
                className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                disabled
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Số điện thoại
              </p>
              <input
                value={userDetails.phone}
                className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                disabled
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">Vai trò</p>
              <input
                value={userDetails.role}
                className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                disabled
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={openUpdateModal}
        size="lg"
        onClose={() => setOpenUpdateModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body className="px-10">
          <div className="space-y-4">
            <h3 className="text-xl text-center text-gray-900 dark:text-white font-manrope font-extrabold">
              Người dùng / Chỉnh sửa
            </h3>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">Họ và tên</p>
              <input
                id="fullName"
                value={userDetails.fullName}
                className="w-full px-5 font-semibold font-manrope py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) =>
                  setUserDetails({ ...userDetails, fullName: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Số điện thoại
              </p>
              <input
                id="phone"
                value={userDetails.phone}
                className="w-full px-5 font-semibold font-manrope py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) =>
                  setUserDetails({ ...userDetails, phone: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">Vai trò</p>
              <select
                id="role"
                value={userDetails.roleId}
                className="w-full px-5 font-semibold font-manrope py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) =>
                  setUserDetails({ ...userDetails, roleId: e.target.value })
                }
              >
                {userRoles.map((role) => (
                  <option
                    key={role._id}
                    value={role._id}
                    className="font-medium font-manrope"
                  >
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex justify-center">
              <button
                className="px-6 py-2 rounded bg-[#0A0A0A] text-white font-extrabold mt-6 font-manrope"
                onClick={handleUpdateUser}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
