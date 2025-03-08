"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { getFilenameAndExtension } from "@/utils";
import { useLoading } from "@/context/loadingContext";
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "@/services/bannerService";
import { deleteImage, uploadImages } from "@/services/imageService";
import { Banner as BannerModel } from "@/models/Banner";
import { useAuthentication } from "@/context/AuthenticationContext";
import { validateBannerForm, validateImageUpload } from "@/validates/admin";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import NotFoundPage from "@/components/NotFoundPage";
import DialogTitle from "@/components/ui/DialogTitle";
import DialogContent from "@/components/ui/DialogContent";

export default function BannerManagement() {
  const { setLoading } = useLoading();
  const { adminToken } = useAuthentication();
  const [banners, setBanners] = useState<BannerModel[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  // const [selectedBanner, setSelectedBanner] = useState<BannerModel>();
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [textError, setTextError] = useState("");

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
    if (files && files.length > 0) {
      const file = files[0];
      const validation = validateImageUpload(file);
      if (!validation.isValid) {
        setTextError(validation.errorMessage);
        return;
      }
      const filesUploaded = await uploadImages(file, adminToken);
      if (!filesUploaded) {
        setTextError("Tải ảnh lên không thành công");
        return;
      }
      setImage(filesUploaded[0]);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImagePreview = async () => {
    const response = await deleteImage(image, adminToken, "banner");
    if (response) {
      setImage("");
      setImagePreview("");
      setTextError("");
      return;
    }
    setTextError("Không thể xóa được ảnh này!");
  };

  const handleSubmit = async () => {
    const validation = validateBannerForm(title, subTitle, image);
    if (validation.isValid) {
      let response = null;
      setTextError("");
      if (validation.data) {
        if (modalType === "add") {
          response = await createBanner(validation.data, adminToken);
        } else if (modalType === "edit") {
          response = await updateBanner({ ...validation.data, id }, adminToken);
        }
      }
      if (response) {
        if (response.error) {
          if (response.message === "Banner title already exists.") {
            setTextError("Tên banner đã tồn tại!");
          }
        } else {
          setOpenModal(false);
          fetchBannersData();
        }
      } else {
        setTextError("Thao tác không thành công!");
      }
    } else {
      setTextError(validation.errorMessage);
    }
  };

  const handleDelete = async () => {
    const response = await deleteBanner(id, adminToken);
    if (response) {
      setOpenModal(false);
      fetchBannersData();
    }
  };

  const handleCancel = () => {
    if (image) {
      handleClearImagePreview();
    }
    setOpenModal(false);
  };

  const fetchBannersData = async (mode: string = "active") => {
    setLoading(true);
    const data = await getBanners(mode);
    setBanners(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBannersData();
  }, []);

  if (!banners) return <NotFoundPage />;

  const openEditModal = (banner: BannerModel) => {
    setId(banner.id || 0);
    setTitle(banner.title);
    setSubTitle(banner.sub_title || "");
    setImage(getFilenameAndExtension(banner.image));

    setImagePreview(banner.image);
    setTextError("");
    setModalType("edit");
    setOpenModal(true);
  };

  const handleSetDeleteState = (bannerId: number, modalType: string) => {
    setId(bannerId);
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
        onClick={() => fetchBannersData("active")}
      >
        Banner có sẵn
      </Button>
      <Button
        className="mb-4 ml-4"
        variant="destructive"
        onClick={() => fetchBannersData("inactive")}
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
                      onClick={() =>
                        handleSetDeleteState(banner.id || 0, "delete")
                      }
                    >
                      Xóa tạm thời
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => openEditModal(banner)}
                    >
                      Khôi phục
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleSetDeleteState(banner.id || 0, "delete-force")
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
            {modalType === "delete" && (
              <p>Bạn có chắc chắn muốn xóa banner {title} không?</p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              {(modalType === "add" || modalType === "edit") && (
                <Button variant="green" onClick={handleSubmit}>
                  {modalType === "add" ? "Thêm banner" : "Cập nhật banner"}
                </Button>
              )}
              {modalType === "delete" && (
                <Button variant="destructive" onClick={handleDelete}>
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
