"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";

import {
  createCategory,
  deleteCategory,
  getCategories,
  restoreCategory,
  updateCategory,
} from "@/services/categoryService";

import { getFilenameAndExtension, normalizeObject } from "@/utils";
import { deleteImage, uploadImages } from "@/services/imageService";
import { Category } from "@/models/Category";
import { useAuthentication } from "@/context/authenticationContext";
import { validateCategoryForm, validateImageUpload } from "@/validates/admin";

import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import NotFoundPage from "@/components/NotFoundPage";
import DialogTitle from "@/components/ui/DialogTitle";
import PaginationBar from "@/components/PaginationBar";
import DialogContent from "@/components/ui/DialogContent";

export default function CategoryManagement() {
  const { adminToken, handleAdminLogout } = useAuthentication();
  const [categories, setCategories] = useState<Category[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modeData, setModeData] = useState("active");
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [newEditImage, setNewEditImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [textError, setTextError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState<number>(0);

  const [hasHandled, setHasHandled] = useState<boolean>(false);

  const handleClickAddCategoryButton = () => {
    setModalType("add");
    setOpenModal(true);
    setName("");
    setDescription("");
    setImage("");
    setImagePreview("");
    setTextError("");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    let response = null;

    if (modalType === "edit" && newEditImage) {
      response = await deleteImage(
        newEditImage,
        adminToken,
        "category",
        handleAdminLogout
      );
      if (response) {
        setTextError("");
        return;
      }
      setTextError("Không thể xóa được ảnh này!");
      return;
    }

    if (files && files.length > 0) {
      const file = files[0];
      const validation = validateImageUpload(file);
      if (!validation.isValid) {
        setTextError(validation.errorMessage);
        return;
      }
      const response = await uploadImages(file, adminToken, handleAdminLogout);

      if (response.error) {
        setTextError("Tải ảnh lên không thành công");
        return;
      }

      if (modalType === "edit") {
        setNewEditImage(getFilenameAndExtension(response.files[0]));
      } else {
        setImage(getFilenameAndExtension(response.files[0]));
      }

      setImagePreview(response.files[0]);
    }
  };

  const handleClearImagePreview = async () => {
    let response = true;
    if (modalType === "edit" && newEditImage) {
      response = await deleteImage(
        newEditImage,
        adminToken,
        "category",
        handleAdminLogout
      );
    } else if (modalType === "add" && image) {
      response = await deleteImage(
        image,
        adminToken,
        "category",
        handleAdminLogout
      );
    }
    if (response) {
      if (modalType !== "edit") {
        setImage("");
      }
      setNewEditImage("");
      setImagePreview("");
      setTextError("");
      return;
    }
    setTextError("Không thể xóa được ảnh này!");
  };

  const handleSubmit = async () => {
    const validation = validateCategoryForm(
      name,
      modalType === "edit" ? newEditImage : image,
      description,
      modalType
    );
    if (validation.isValid) {
      let response = null;
      setTextError("");
      if (validation.data) {
        if (modalType === "add") {
          response = await createCategory(
            validation.data,
            adminToken,
            handleAdminLogout
          );
        } else if (modalType === "edit") {
          response = await updateCategory(
            { ...validation.data, id },
            adminToken,
            handleAdminLogout
          );
        }
      }
      if (response) {
        if (response.error) {
          if (response.message === "Category name already exists.") {
            setTextError("Tên danh mục đã tồn tại!");
            return;
          }
          handleClearImagePreview();
        } else {
          setOpenModal(false);
          setHasHandled(true);
          if (page === 1 && modeData === "active") {
            fetchCategoriesData();
          } else {
            setPage(1);
            setModeData("active");
          }
        }
      } else {
        setTextError("Thao tác không thành công!");
      }
    } else {
      setTextError(validation.errorMessage);
    }
  };

  const handleRestore = async (categoryId: number) => {
    const response = await restoreCategory(
      categoryId,
      adminToken,
      handleAdminLogout
    );
    if (response) {
      setPage(1);
      setModeData("active");
    }
  };

  const handleDelete = async (model: string) => {
    const response = await deleteCategory(
      id,
      adminToken,
      model,
      handleAdminLogout
    );
    if (response) {
      setOpenModal(false);
      if (page === 1 && modeData === "active") {
        fetchCategoriesData();
      } else {
        setPage(1);
        setModeData("active");
      }
    }
  };

  const openEditModal = (category: Category) => {
    setId(category.id || 0);
    setName(category.name);
    setDescription(category.description || "");
    setImage(getFilenameAndExtension(category.image));
    setNewEditImage("");

    setImagePreview(category.image);
    setTextError("");
    setModalType("edit");
    setOpenModal(true);
  };

  const handleSetDeleteState = (category: Category, modalType: string) => {
    setId(category.id || 0);
    setName(category.name);
    setModalType(modalType);
    setOpenModal(true);
  };

  const handleCancel = () => {
    if (modalType === "add" && image) {
      handleClearImagePreview();
    } else if (modalType === "edit" && newEditImage) {
      handleClearImagePreview();
    }
    setOpenModal(false);
    setHasHandled(true);
  };

  const fetchCategoriesData = async (mode: string = "active") => {
    const response = await getCategories(
      { page: page.toString(), pageSize: pageSize.toString(), mode },
      handleAdminLogout
    );
    const normalizedData = normalizeObject(
      response.data
    ) as unknown as Category[];
    setCategories(normalizedData);
    setTotalPages(
      response.total_pages ? parseInt(response.total_pages.toString()) : 0
    );
  };

  useEffect(() => {
    fetchCategoriesData(modeData);
  }, [page, modeData]);

  useEffect(() => {
    if (openModal) {
      setHasHandled(false);
    }

    if (!openModal && !hasHandled) {
      handleCancel();
    }
  }, [openModal]);

  if (!categories) return <NotFoundPage />;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý danh mục</h1>
      <Button className="mb-4" onClick={handleClickAddCategoryButton}>
        + Thêm mới
      </Button>
      <Button
        className="mb-4 ml-4"
        variant="green"
        onClick={() => {
          setPage(1);
          setModeData("active");
        }}
      >
        Danh mục có sẵn
      </Button>
      <Button
        className="mb-4 ml-4"
        variant="destructive"
        onClick={() => {
          setPage(1);
          setModeData("inactive");
        }}
      >
        Danh mục đã xóa tạm thời
      </Button>
      <table className="w-full max-w-full text-left table-auto">
        <thead>
          <tr>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Mã danh mục
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Tiêu đề
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">Mô tả</th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className={"hover:bg-slate-50 bg-white text-gray-400"}
            >
              <td className="p-4 border-b border-slate-200">{category.id}</td>
              <td className="p-4 border-b border-slate-200">{category.name}</td>
              <td className="p-4 border-b border-slate-200">
                <div
                  className="line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: category.description }}
                />
              </td>
              <td className="p-4 border-b border-slate-200">
                {category.status ? (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => openEditModal(category)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      className="mr-2"
                      variant="destructive"
                      onClick={() => handleSetDeleteState(category, "delete")}
                    >
                      Xóa tạm thời
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => handleRestore(category.id || 0)}
                    >
                      Khôi phục
                    </Button>
                    <Button
                      className="mr-2"
                      variant="destructive"
                      onClick={() =>
                        handleSetDeleteState(category, "delete-force")
                      }
                    >
                      Xóa viễn viễn
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />

      {/* Modal */}
      <Dialog width={800} open={openModal} onClose={() => setOpenModal(false)}>
        <DialogContent>
          <DialogTitle>
            {modalType === "add" && "Thêm danh mục"}
            {modalType === "edit" && "Chỉnh sửa danh mục"}
            {modalType === "delete" && "Xác nhận xóa"}
          </DialogTitle>
          <div className="p-4">
            {(modalType === "add" || modalType === "edit") && (
              <form>
                {textError && <div className="text-red-500">{textError}</div>}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tiêu đề
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mô tả
                  </label>
                  <Editor
                    apiKey="v5pij1okvrobhmxz0xowm11k3o9ftcmbxpm3cqsjhk56y0ac"
                    value={description}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: ["image"],
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | removeformat | help",
                      automatic_uploads: true,
                      images_upload_handler: (blobInfo: {
                        blob: () => Blob;
                      }) => {
                        return new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (reader.result) {
                              resolve(reader.result.toString());
                            } else {
                              reject("Failed to read file");
                            }
                          };
                          reader.onerror = () => reject("File reading error");
                          reader.readAsDataURL(blobInfo.blob());
                        });
                      },
                    }}
                    onEditorChange={setDescription}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Chọn ảnh
                  </label>
                  <input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md"
                  />
                </div>

                {imagePreview && (
                  <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Preview ảnh
                    </label>
                    <div className="w-[100px] bg-gray-100 rounded-md overflow-hidden relative">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleClearImagePreview} // Clear the preview when clicked
                        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
            {(modalType === "delete" || modalType === "delete-force") && (
              <p>
                Bạn có chắc chắn muốn xóa danh mục {name}{" "}
                {modalType === "delete-force" && "viễn viễn"} không?
              </p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              {(modalType === "add" || modalType === "edit") && (
                <Button variant="green" onClick={handleSubmit}>
                  {modalType === "add" ? "Thêm danh mục" : "Cập nhật danh mục"}
                </Button>
              )}
              {(modalType === "delete" || modalType === "delete-force") && (
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(modalType)}
                >
                  Xác nhận
                </Button>
              )}
              <Button onClick={handleCancel}>Hủy</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
