import { useState, useEffect, useContext } from "react";
import { Table, Modal, Label, TextInput, Button } from "flowbite-react";
import { Dropdown } from "flowbite-react";
import { Clock8 } from "lucide-react";

import {
  archiveUserById,
  createUser,
  getAllUsers,
  updateUserById,
} from "../../data/users";
import { getAllUserRoles, getUserRoleById } from "../../data/userRoles";
import Search from "../../components/Search";
import GenericDropdown from "../../components/GenericDropdown";
import toast from "react-hot-toast";
import { ITEM_PER_PAGE, ROLE_NAME, USER_STATUS } from "../../utils/Constants";
import Pagination from "../../components/Pagination";
import Error from "../Error";
import AuthContext from "../../context/AuthContext";
import Cookies from "js-cookie";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { auth, setHasError } = useContext(AuthContext);
  const permission = Cookies.get("permission") ?? null;

  function onCloseCreateModal() {
    setOpenCreateModal(false);
  }

  async function fetchUsers() {
    try {
      setLoading(true);

      // Determine isActive value for backend
      let isActive = null;
      if (selectedStatus === USER_STATUS.ACTIVE) {
        isActive = true;
      } else if (selectedStatus === USER_STATUS.INACTIVE) {
        isActive = false;
      }

      // Determine roleName for backend
      const roleName = selectedRole !== "All" ? selectedRole : undefined;

      const result = await getAllUsers(
        currentPage,
        ITEM_PER_PAGE,
        debouncedSearchTerm || undefined,
        isActive,
        roleName
      );

      // The backend already joins with userRole, so we don't need to fetch roles separately
      const updatedUsers = result.data.map((user) => ({
        ...user,
        role: user.userRoleInfo?.roleName || "Unknown Role",
      }));

      setUsers(updatedUsers);
      setMetadata(result.meta);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }

  const fetchUserRoles = async () => {
    try {
      const fetchedUserRoles = await getAllUserRoles();
      setUserRoles(fetchedUserRoles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case USER_STATUS.ACTIVE:
        return "bg-green-100 text-green-600";
      case USER_STATUS.INACTIVE:
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedRole, selectedStatus]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearchTerm, selectedRole, selectedStatus]);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  // No need for client-side pagination anymore since we're using server-side pagination

  // Prepare filter options
  const roleOptions = [
    { key: "all", value: "All", label: "Tất cả" },
    ...ROLE_NAME.map((item) => ({
      key: item.key,
      value: item.value,
      label: item.key,
    })),
  ];

  const statusOptions = [
    { key: "all", value: "All", label: "Tất cả" },
    ...Object.values(USER_STATUS).map((status) => ({
      key: status.toLowerCase(),
      value: status,
      label: status,
    })),
  ];

  const handleCreateUser = async () => {
    try {
      await createUser(email, fullName, phone, password, userRole);
      toast.success("Thêm người dùng thành công", { duration: 2000 });
      await fetchUsers();
      setEmail("");
      setFullName("");
      setPhone("");
      setPassword("");
      setUserRole("");
      setOpenCreateModal(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        duration: 2000,
      });
    }
  };

  const handleUpdateUser = async () => {
    try {
      await updateUserById(
        userDetails._id,
        userDetails.fullName,
        userDetails.phone,
        userDetails.roleId
      );
      toast.success("Cập nhật người dùng thành công", { duration: 2000 });
      await fetchUsers();
      setOpenUpdateModal(false);
    } catch (error) {
      toast.error(error.response.data.message, { duration: 2000 });
    }
  };

  const handleDeleteUser = async (id, isActive) => {
    try {
      await archiveUserById(id);
      await fetchUsers();
      if (isActive) {
        toast.success("Lưu trữ người dùng thành công", { duration: 2000 });
      } else {
        toast.success("Khôi phục người dùng thành công", { duration: 2000 });
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        duration: 2000,
      });
    }
  };

  if (!permission || !permission.includes("USERS")) {
    setHasError(true);
    return (
      <Error
        errorCode={403}
        title={"Forbidden"}
        content={"Bạn không có quyền truy cập trang này."}
      />
    );
  }

  return (
    <>
      <div className="p-10 w-full">
        <p className="font-extrabold text-xl">Người dùng</p>
        <div className="bg-white rounded-lg mt-10 p-6 shadow-md flex flex-col">
          <div className="overflow-x-auto">
            <div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center gap-x-3 pb-4">
              <Search
                placeholder={"Tên hoặc email..."}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="w-fit">
                <GenericDropdown
                  value={selectedRole}
                  onChange={(value) => setSelectedRole(value)}
                  options={roleOptions}
                  placeholder="Chọn vai trò"
                  displayKey="label"
                  valueKey="value"
                  className="min-w-[140px]"
                />
              </div>
              <div className="w-fit">
                <GenericDropdown
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value)}
                  options={statusOptions}
                  placeholder="Chọn trạng thái"
                  displayKey="label"
                  valueKey="value"
                  className="min-w-[160px]"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head className="normal-case text-base">
                  <Table.HeadCell>Mã người dùng</Table.HeadCell>
                  <Table.HeadCell>Họ và tên</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Số điện thoại</Table.HeadCell>
                  <Table.HeadCell>Vai trò</Table.HeadCell>
                  <Table.HeadCell>Trạng thái</Table.HeadCell>
                  <Table.HeadCell>Thao tác</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {loading ? (
                    <Table.Row>
                      <Table.Cell colSpan={7} className="text-center py-4">
                        <div className="flex justify-center items-center">
                          <Clock8 className="animate-spin h-5 w-5 mr-2" />
                          Đang tải...
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ) : users.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={7} className="text-center py-4">
                        Không có dữ liệu
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    users.map((user) => (
                      <Table.Row
                        key={user._id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white max-w-40 truncate overflow-hidden text-ellipsis">
                          {user._id}
                        </Table.Cell>
                        <Table.Cell>{user.fullName}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.phone}</Table.Cell>
                        <Table.Cell>{user.role}</Table.Cell>
                        <Table.Cell>
                          <div
                            className={`px-3 py-1 rounded-lg text-center font-semibold ${getStatusClass(
                              user.isActive
                                ? USER_STATUS.ACTIVE
                                : USER_STATUS.INACTIVE
                            )}`}
                          >
                            {user.isActive
                              ? "Đang hoạt động"
                              : "Ngưng hoạt động"}
                          </div>
                        </Table.Cell>
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
                              onClick={() =>
                                handleDeleteUser(user._id, user.isActive)
                              }
                              className="font-medium text-[#EF0606] hover:underline"
                            >
                              <div className="flex flex-row gap-x-1 items-center">
                                {user.isActive ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="#EF0606"
                                    class="size-5"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z"
                                      clip-rule="evenodd"
                                    />
                                    <path
                                      fill-rule="evenodd"
                                      d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="#EF0606"
                                    class="size-5"
                                  >
                                    <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
                                  </svg>
                                )}
                                <p className="text-[#EF0606]">
                                  {user.isActive ? "Lưu trữ" : "Khôi phục"}
                                </p>
                              </div>
                            </button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-5">
              {metadata.totalCount > 0 ? (
                <div className="font-semibold text-sm">
                  Hiển thị {(metadata.currentPage - 1) * ITEM_PER_PAGE + 1} -{" "}
                  {Math.min(
                    metadata.currentPage * ITEM_PER_PAGE,
                    metadata.totalCount
                  )}{" "}
                  của {metadata.totalCount} kết quả
                </div>
              ) : (
                <div className="font-semibold text-sm">
                  Hiển thị 0 - 0 của 0 kết quả
                </div>
              )}
              {users.length > 0 && metadata.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={metadata.totalPages}
                  onPageChange={setCurrentPage}
                  svgClassName={"w-5 h-5"}
                  textClassName={"text-sm px-3 py-2"}
                />
              )}
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
