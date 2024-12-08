import { useState, useEffect } from "react";
import { Table, Modal } from "flowbite-react";

import Search from "../../components/Search";

import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  updateCategory,
} from "../../data/categories";
import toast from "react-hot-toast";
import { GENDER } from "../../utils/Constants";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [categoryDetails, setCategoryDetails] = useState({});
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  function onCloseModal() {
    setOpenCreateModal(false);
  }

  const handleCreateCategory = async () => {
    try {
      const createdCategory = await createCategory(category, gender);
      setCategories([...categories, createdCategory]);
      setCategory("");
      setOpenCreateModal(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategoryById(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Delete category successfully", { duration: 2000 });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Delete category failed", { duration: 2000 });
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleUpdateCategory = async () => {
    const response = await updateCategory(
      categoryDetails._id,
      categoryDetails.name,
      categoryDetails.gender
    );
    if (response) {
      toast.success("Update category successfully", { duration: 2000 });
      fetchCategories();
      setOpenUpdateModal(false);
    } else {
      toast.error("Update category failed", { duration: 2000 });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div className="p-10 w-full">
        <p className="font-extrabold text-xl">Categories</p>
        <div className="bg-white rounded-lg mt-10 p-6 shadow-md flex flex-col">
          <div className="overflow-x-auto">
            <div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
              {/* <button
                id="dropdownRadioButton"
                data-dropdown-toggle="dropdownRadio"
                class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 "
                type="button"
              >
                <svg
                  class="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                </svg>
                Last 30 days
                <svg
                  class="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdownRadio"
                class="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                data-popper-reference-hidden=""
                data-popper-escaped=""
                data-popper-placement="top"
                style={{
                  position: "absolute",
                  inset: "auto auto 0px 0px",
                  margin: "0px",
                  transform: "translate3d(522.5px, 3847.5px, 0px)",
                }}
              >
                <ul
                  class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownRadioButton"
                >
                  <li>
                    <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="filter-radio-example-1"
                        type="radio"
                        value=""
                        name="filter-radio"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        for="filter-radio-example-1"
                        class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        Last day
                      </label>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        checked=""
                        id="filter-radio-example-2"
                        type="radio"
                        value=""
                        name="filter-radio"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        for="filter-radio-example-2"
                        class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        Last 7 days
                      </label>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="filter-radio-example-3"
                        type="radio"
                        value=""
                        name="filter-radio"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        for="filter-radio-example-3"
                        class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        Last 30 days
                      </label>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="filter-radio-example-4"
                        type="radio"
                        value=""
                        name="filter-radio"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        for="filter-radio-example-4"
                        class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        Last month
                      </label>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="filter-radio-example-5"
                        type="radio"
                        value=""
                        name="filter-radio"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                      />
                      <label
                        for="filter-radio-example-5"
                        class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        Last year
                      </label>
                    </div>
                  </li>
                </ul>
              </div> */}
              <Search />
            </div>
            <Table hoverable>
              <Table.Head className="normal-case text-base">
                <Table.HeadCell>Category ID</Table.HeadCell>
                <Table.HeadCell>Category Name</Table.HeadCell>
                <Table.HeadCell>Gender</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {categories.map((category) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={category._id}
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {category._id}
                    </Table.Cell>
                    <Table.Cell>{category.name}</Table.Cell>
                    <Table.Cell>{category.gender}</Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-row gap-x-3">
                        <button
                          className="font-medium hover:underline"
                          onClick={() => {
                            setCategoryDetails(category);
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
                            <p className="text-[#0A0A0A]">View</p>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setCategoryDetails(category);
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
                            <p className="text-blue-600">Edit</p>
                          </div>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="font-medium text-[#EF0606] hover:underline"
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
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M11 2.9853V3.13663C11.866 3.21582 12.7285 3.32969 13.5853 3.47797C13.65 3.48917 13.7119 3.51301 13.7674 3.54812C13.8229 3.58324 13.8709 3.62893 13.9087 3.6826C13.9465 3.73628 13.9734 3.79687 13.9878 3.86093C14.0022 3.925 14.0039 3.99127 13.9927 4.05597C13.9815 4.12066 13.9576 4.18252 13.9225 4.23801C13.8874 4.29349 13.8417 4.34152 13.788 4.37934C13.7344 4.41716 13.6738 4.44405 13.6097 4.45845C13.5456 4.47286 13.4794 4.4745 13.4147 4.4633L13.2753 4.43997L12.6053 13.1533C12.5667 13.6557 12.3399 14.125 11.9702 14.4674C11.6005 14.8097 11.1152 14.9999 10.6113 15H5.38934C4.88547 14.9999 4.40017 14.8097 4.03049 14.4674C3.6608 14.125 3.43397 13.6557 3.39534 13.1533L2.72467 4.43997L2.58534 4.4633C2.52064 4.4745 2.45437 4.47286 2.39031 4.45845C2.32625 4.44405 2.26565 4.41716 2.21198 4.37934C2.10358 4.30295 2.02997 4.18663 2.00734 4.05597C1.98471 3.9253 2.01491 3.791 2.0913 3.6826C2.16769 3.57421 2.28401 3.5006 2.41467 3.47797C3.27152 3.32952 4.13399 3.21565 5 3.13663V2.9853C5 1.94263 5.80867 1.05197 6.87734 1.01797C7.62581 0.994012 8.37486 0.994012 9.12334 1.01797C10.192 1.05197 11 1.94263 11 2.9853ZM6.90934 2.0173C7.63649 1.99404 8.36419 1.99404 9.09134 2.0173C9.59334 2.0333 10 2.45597 10 2.9853V3.06063C8.6679 2.97973 7.33211 2.97973 6 3.06063V2.9853C6 2.45597 6.406 2.0333 6.90934 2.0173ZM6.67267 5.98063C6.67013 5.91497 6.65469 5.85045 6.62721 5.79076C6.59974 5.73107 6.56078 5.67738 6.51255 5.63274C6.46433 5.58811 6.40779 5.55341 6.34615 5.53063C6.28452 5.50785 6.219 5.49743 6.15334 5.49997C6.08768 5.5025 6.02316 5.51795 5.96347 5.54542C5.90378 5.5729 5.85008 5.61186 5.80545 5.66008C5.76081 5.70831 5.72611 5.76485 5.70333 5.82649C5.68055 5.88812 5.67013 5.95364 5.67267 6.0193L5.904 12.0193C5.90913 12.1518 5.96669 12.2769 6.06402 12.367C6.11222 12.4116 6.16873 12.4462 6.23032 12.469C6.29191 12.4918 6.35739 12.5022 6.423 12.4996C6.48862 12.4971 6.5531 12.4817 6.61275 12.4542C6.6724 12.4267 6.72606 12.3878 6.77066 12.3396C6.81526 12.2914 6.84994 12.2349 6.8727 12.1733C6.89547 12.1117 6.90588 12.0463 6.90334 11.9806L6.67267 5.98063ZM10.326 6.0193C10.3309 5.95238 10.3223 5.88516 10.3006 5.82164C10.279 5.75812 10.2448 5.69961 10.2001 5.64959C10.1553 5.59957 10.101 5.55907 10.0403 5.53049C9.97957 5.50191 9.91373 5.48585 9.84668 5.48325C9.77963 5.48066 9.71274 5.49158 9.65 5.51538C9.58726 5.53918 9.52996 5.57536 9.4815 5.62177C9.43304 5.66818 9.39441 5.72388 9.36793 5.78553C9.34144 5.84718 9.32764 5.91353 9.32734 5.98063L9.096 11.9806C9.09088 12.1132 9.13864 12.2425 9.22878 12.3398C9.31892 12.4372 9.44406 12.4948 9.57667 12.5C9.70928 12.5051 9.83849 12.4573 9.93589 12.3672C10.0333 12.277 10.0909 12.1519 10.096 12.0193L10.326 6.0193Z"
                                fill="#EF0606"
                              />
                            </svg>
                            <p className="text-[#EF0606]">Delete</p>
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
        <button
          className="px-6 py-2 rounded bg-[#0A0A0A] text-white font-extrabold mt-10"
          onClick={() => setOpenCreateModal(true)}
        >
          New Category
        </button>
      </div>
      <Modal show={openCreateModal} size="lg" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body className="px-10">
          <div className="space-y-4">
            <h3 className="text-xl text-center text-gray-900 dark:text-white font-manrope font-extrabold">
              Categories / Create
            </h3>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope text-sm font-semibold">
                Category Name<b className="text-[#EF0606]">*</b>
              </p>
              <input
                id="category"
                value={category}
                className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope text-sm font-semibold">
                Gender <b className="text-[#EF0606]">*</b>
              </p>
              <select
                value={gender}
                className="w-full px-5 py-3 border border-[#808191] font-manrope font-medium focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value={""} className="font-medium font-manrope text-sm">
                  Choose gender
                </option>
                {GENDER.map((gender) => (
                  <option
                    key={gender.key}
                    value={gender.value}
                    className="font-medium font-manrope text-sm"
                  >
                    {gender.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex justify-center">
              <button
                className="px-6 py-2 rounded bg-[#0A0A0A] text-white font-extrabold mt-6 font-manrope"
                onClick={handleCreateCategory}
              >
                Create Category
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
              Categories / Details
            </h3>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Category Name
              </p>
              <input
                value={categoryDetails.name}
                className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                disabled
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">Gender</p>
              <input
                value={categoryDetails.gender}
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
              Categories / Update
            </h3>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Category Name
              </p>
              <input
                value={categoryDetails.name}
                className="w-full px-5 font-semibold font-manrope py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) =>
                  setCategoryDetails({
                    ...categoryDetails,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">Gender</p>
              <select
                value={categoryDetails.gender}
                className="w-full px-5 py-3 border border-[#808191] font-manrope font-medium focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) =>
                  setCategoryDetails({
                    ...categoryDetails,
                    gender: e.target.value,
                  })
                }
              >
                {GENDER.map((gender) => (
                  <option
                    key={gender.key}
                    value={gender.value}
                    className="font-medium font-manrope text-sm"
                  >
                    {gender.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex justify-center">
              <button
                className="px-6 py-2 rounded bg-[#0A0A0A] text-white font-extrabold mt-6 font-manrope"
                onClick={handleUpdateCategory}
              >
                Save changes
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
