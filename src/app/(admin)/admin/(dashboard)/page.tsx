"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  createBanner,
  deleteBanner,
  getBanners,
  restoreBanner,
  updateBanner,
} from "@/services/bannerService";

import { getFilenameAndExtension, normalizeObject } from "@/utils";
import { deleteImage, uploadImages } from "@/services/imageService";
import { Banner, Banner as BannerModel } from "@/models/Banner";
import { useAuthentication } from "@/context/authenticationContext";
import { validateBannerForm, validateImageUpload } from "@/validates/admin";

import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import NotFoundPage from "@/components/NotFoundPage";
import DialogTitle from "@/components/ui/DialogTitle";
import PaginationBar from "@/components/PaginationBar";
import DialogContent from "@/components/ui/DialogContent";

export default function BannerManagement() {
  const { adminToken, handleAdminLogout } = useAuthentication();
  const [banners, setBanners] = useState<BannerModel[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modeData, setModeData] = useState("active");
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState<string>("");
  const [newEditImage, setNewEditImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [textError, setTextError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 2;
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleClickAddBannerButton = () => {
    setModalType("add");
    setOpenModal(true);
    setTitle("");
    setSubTitle("");
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
        "banner",
        handleAdminLogout
      );
      if (response) {
        // setImage("");
        // setImagePreview("");
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
        setNewEditImage(response.files[0]);
      } else {
        setImage(response.files[0]);
      }

      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImagePreview = async () => {
    let response = true;
    if (modalType === "edit" && newEditImage) {
      response = await deleteImage(
        newEditImage,
        adminToken,
        "banner",
        handleAdminLogout
      );
    } else if (modalType === "add" && image) {
      response = await deleteImage(
        image,
        adminToken,
        "banner",
        handleAdminLogout
      );
    }
    if (response) {
      setImage("");
      setNewEditImage("");
      setImagePreview("");
      setTextError("");
      return;
    }
    setTextError("Không thể xóa được ảnh này!");
  };

  const handleSubmit = async () => {
    const validation = validateBannerForm(
      title,
      subTitle,
      newEditImage || image
    );
    if (validation.isValid) {
      let response = null;
      setTextError("");
      if (validation.data) {
        if (modalType === "add") {
          response = await createBanner(
            validation.data,
            adminToken,
            handleAdminLogout
          );
        } else if (modalType === "edit") {
          response = await updateBanner(
            { ...validation.data, id },
            adminToken,
            handleAdminLogout
          );
        }
      }
      if (response) {
        if (response.error) {
          if (response.message === "Banner title already exists.") {
            setTextError("Tên banner đã tồn tại!");
          }
        } else {
          setOpenModal(false);
          if (page === 1 && modeData === "active") {
            fetchBannersData();
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

  const handleRestore = async (bannerId: number) => {
    const response = await restoreBanner(
      bannerId,
      adminToken,
      handleAdminLogout
    );
    if (response) {
      setPage(1);
      setModeData("active");
    }
  };

  const handleDelete = async (model: string) => {
    const response = await deleteBanner(
      id,
      adminToken,
      model,
      handleAdminLogout
    );
    if (response) {
      setOpenModal(false);
      if (page === 1 && modeData === "active") {
        fetchBannersData();
      } else {
        setPage(1);
        setModeData("active");
      }
    }
  };

  const handleCancel = () => {
    if (modalType === "add") {
      if (image) {
        handleClearImagePreview();
      }
    } else if (modalType === "edit" && newEditImage) {
      handleClearImagePreview();
    }
    setOpenModal(false);
  };

  const fetchBannersData = async (mode: string = "active") => {
    const response = await getBanners(
      { page, pageSize, mode },
      handleAdminLogout
    );
    const normalizedData = normalizeObject(
      response.data
    ) as unknown as Banner[];
    setBanners(normalizedData);
    setTotalPages(
      response.total_pages ? parseInt(response.total_pages.toString()) : 0
    );
  };

  useEffect(() => {
    fetchBannersData(modeData);
  }, [page, modeData]);

  if (!banners) return <NotFoundPage />;

  const openEditModal = (banner: BannerModel) => {
    setId(banner.id || 0);
    setTitle(banner.title);
    setSubTitle(banner.sub_title || "");
    setImage(getFilenameAndExtension(banner.image));
    setNewEditImage("");

    setImagePreview(banner.image);
    setTextError("");
    setModalType("edit");
    setOpenModal(true);
  };

  const handleSetDeleteState = (banner: Banner, modalType: string) => {
    setId(banner.id || 0);
    setTitle(banner.title);
    setModalType(modalType);
    setOpenModal(true);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý banner</h1>
      <Button className="mb-4" onClick={handleClickAddBannerButton}>
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
        Banner có sẵn
      </Button>
      <Button
        className="mb-4 ml-4"
        variant="destructive"
        onClick={() => {
          setPage(1);
          setModeData("inactive");
        }}
      >
        Banner đã xóa tạm thời
      </Button>
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Mã banner
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Tiêu đề
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Tiêu đề phụ
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr
              key={banner.id}
              className={"hover:bg-slate-50 bg-white text-gray-400"}
            >
              <td className="p-4 border-b border-slate-200">{banner.id}</td>
              <td className="p-4 border-b border-slate-200">{banner.title}</td>
              <td className="p-4 border-b border-slate-200">
                {banner.sub_title}
              </td>
              <td className="p-4 border-b border-slate-200">
                {banner.status ? (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => openEditModal(banner)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleSetDeleteState(banner, "delete")}
                    >
                      Xóa tạm thời
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => handleRestore(banner.id || 0)}
                    >
                      Khôi phục
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleSetDeleteState(banner, "delete-force")
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogContent>
          <DialogTitle>
            {modalType === "add" && "Thêm banner"}
            {modalType === "edit" && "Chỉnh sửa banner"}
            {modalType === "delete" && "Xác nhận xóa"}
          </DialogTitle>
          <div className="p-4">
            {(modalType === "add" || modalType === "edit") && (
              <form>
                {textError && <div className="text-red-500">{textError}</div>}
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tiêu đề
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="subTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mô tả phụ
                  </label>
                  <input
                    id="subTitle"
                    type="text"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả phụ"
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
                Bạn có chắc chắn muốn xóa banner {title}{" "}
                {modalType === "delete-force" && "viễn viễn"} không?
              </p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              {(modalType === "add" || modalType === "edit") && (
                <Button variant="green" onClick={handleSubmit}>
                  {modalType === "add" ? "Thêm banner" : "Cập nhật banner"}
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
