"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  createEvaluate,
  deleteEvaluate,
  getEvaluates,
  restoreEvaluate,
  updateEvaluate,
} from "@/services/evaluateService";

import { getFilenameAndExtension, normalizeObject } from "@/utils";
import { deleteImage, uploadImages } from "@/services/imageService";
import { Evaluate } from "@/models/Evaluate";
import { useAuthentication } from "@/context/authenticationContext";
import { validateEvaluateForm, validateImageUpload } from "@/validates/admin";

import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import NotFoundPage from "@/components/NotFoundPage";
import DialogTitle from "@/components/ui/DialogTitle";
import PaginationBar from "@/components/PaginationBar";
import DialogContent from "@/components/ui/DialogContent";

export default function EvaluateManagement() {
  const { adminToken, handleAdminLogout } = useAuthentication();
  const [evaluates, setEvaluates] = useState<Evaluate[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modeData, setModeData] = useState("active");
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [content, setContent] = useState("");
  const [newEditAvatar, setNewEditAvatar] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [textError, setTextError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleClickAddEvaluateButton = () => {
    setModalType("add");
    setOpenModal(true);
    setName("");
    setContent("");
    setAvatar("");
    setRate(1);
    setEmail("");
    setAvatarPreview("");
    setTextError("");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    let response = null;

    if (modalType === "edit" && newEditAvatar) {
      response = await deleteImage(
        newEditAvatar,
        adminToken,
        "evaluate",
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
        setNewEditAvatar(response.files[0]);
      } else {
        setAvatar(response.files[0]);
      }

      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleClearAvatarPreview = async () => {
    let response = true;
    if (modalType === "edit" && newEditAvatar) {
      response = await deleteImage(
        newEditAvatar,
        adminToken,
        "evaluate",
        handleAdminLogout
      );
    } else if (modalType === "add" && avatar) {
      response = await deleteImage(
        avatar,
        adminToken,
        "evaluate",
        handleAdminLogout
      );
    }
    if (response) {
      if (modalType !== "edit") {
        setAvatar("");
      }
      setNewEditAvatar("");
      setAvatarPreview("");
      setTextError("");
      return;
    }
    setTextError("Không thể xóa được ảnh này!");
  };

  const handleSubmit = async () => {
    const validation = validateEvaluateForm(
      name,
      newEditAvatar || avatar,
      rate,
      email,
      content
    );
    if (validation.isValid) {
      let response = null;
      setTextError("");
      if (validation.data) {
        if (modalType === "add") {
          response = await createEvaluate(
            validation.data,
            adminToken,
            handleAdminLogout
          );
        } else if (modalType === "edit") {
          response = await updateEvaluate(
            { ...validation.data, id },
            adminToken,
            handleAdminLogout
          );
        }
      }
      if (response) {
        if (response.error) {
          if (response.message === "Evaluate name already exists.") {
            setTextError("Tên đánh giá đã tồn tại!");
            return;
          }
          handleClearAvatarPreview();
        } else {
          setOpenModal(false);
          if (page === 1 && modeData === "active") {
            fetchEvaluatesData();
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

  const handleRestore = async (evaluateId: number) => {
    const response = await restoreEvaluate(
      evaluateId,
      adminToken,
      handleAdminLogout
    );
    if (response) {
      setPage(1);
      setModeData("active");
    }
  };

  const handleDelete = async (model: string) => {
    const response = await deleteEvaluate(
      id,
      adminToken,
      model,
      handleAdminLogout
    );
    if (response) {
      setOpenModal(false);
      if (page === 1 && modeData === "active") {
        fetchEvaluatesData();
      } else {
        setPage(1);
        setModeData("active");
      }
    }
  };

  const handleCancel = () => {
    if (modalType === "add") {
      if (avatar) {
        handleClearAvatarPreview();
      }
    } else if (modalType === "edit" && newEditAvatar) {
      handleClearAvatarPreview();
    }
    setOpenModal(false);
  };

  const fetchEvaluatesData = async (mode: string = "active") => {
    const response = await getEvaluates({ page, pageSize, mode });
    const normalizedData = normalizeObject(
      response.data
    ) as unknown as Evaluate[];
    setEvaluates(normalizedData);
    setTotalPages(
      response.total_pages ? parseInt(response.total_pages.toString()) : 0
    );
  };

  useEffect(() => {
    fetchEvaluatesData(modeData);
  }, [page, modeData]);

  if (!evaluates) return <NotFoundPage />;

  const openEditModal = (evaluate: Evaluate) => {
    setId(evaluate.id || 0);
    setName(evaluate.name);
    setContent(evaluate.content);
    setAvatar(getFilenameAndExtension(evaluate.avatar));
    setEmail(evaluate.email);
    setRate(evaluate.rate);
    setNewEditAvatar("");

    setAvatarPreview(evaluate.avatar);
    setTextError("");
    setModalType("edit");
    setOpenModal(true);
  };

  const handleSetDeleteState = (evaluate: Evaluate, modalType: string) => {
    setId(evaluate.id || 0);
    setName(evaluate.name);
    setModalType(modalType);
    setOpenModal(true);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý đánh giá</h1>
      <Button className="mb-4" onClick={handleClickAddEvaluateButton}>
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
        Phần giới thiệu có sẵn
      </Button>
      <Button
        className="mb-4 ml-4"
        variant="destructive"
        onClick={() => {
          setPage(1);
          setModeData("inactive");
        }}
      >
        Phần giới thiệu đã xóa tạm thời
      </Button>
      <table className="w-full max-w-full text-left table-auto">
        <thead>
          <tr>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Mã đánh giá
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">Name</th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Nội dung đánh giá
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {evaluates.map((evaluate) => (
            <tr
              key={evaluate.id}
              className={"hover:bg-slate-50 bg-white text-gray-400"}
            >
              <td className="p-4 border-b border-slate-200">{evaluate.id}</td>
              <td className="p-4 border-b border-slate-200">{evaluate.name}</td>
              <td className="p-4 border-b border-slate-200">
                {evaluate.content}
              </td>
              <td className="p-4 border-b border-slate-200">
                {evaluate.status ? (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => openEditModal(evaluate)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      className="mr-2"
                      variant="destructive"
                      onClick={() => handleSetDeleteState(evaluate, "delete")}
                    >
                      Xóa tạm thời
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => handleRestore(evaluate.id || 0)}
                    >
                      Khôi phục
                    </Button>
                    <Button
                      className="mr-2"
                      variant="destructive"
                      onClick={() =>
                        handleSetDeleteState(evaluate, "delete-force")
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
            {modalType === "add" && "Thêm đánh giá"}
            {modalType === "edit" && "Chỉnh sửa đánh giá"}
            {modalType === "delete" && "Xác nhận xóa"}
          </DialogTitle>
          <div className="p-4">
            {(modalType === "add" || modalType === "edit") && (
              <form>
                {textError && <div className="text-red-500">{textError}</div>}

                {/* Name */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                {/* Avatar */}
                <div className="mb-4">
                  <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ảnh đại diện
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    onChange={handleAvatarChange}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md"
                  />
                </div>

                {avatarPreview && (
                  <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Preview ảnh
                    </label>
                    <div className="w-[100px] bg-gray-100 rounded-md overflow-hidden relative">
                      <Image
                        src={avatarPreview}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleClearAvatarPreview}
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

                {/* Email */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập email"
                  />
                </div>

                {/* Rating (1-5) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Đánh giá
                  </label>
                  <select
                    id="rate"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn số sao</option>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>
                        {star} ⭐
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content (Textarea) */}
                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nội dung đánh giá
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Nhập nội dung đánh giá"
                  />
                </div>
              </form>
            )}
            {(modalType === "delete" || modalType === "delete-force") && (
              <p>
                Bạn có chắc chắn muốn xóa đánh giá {name}{" "}
                {modalType === "delete-force" && "viễn viễn"} không?
              </p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              {(modalType === "add" || modalType === "edit") && (
                <Button variant="green" onClick={handleSubmit}>
                  {modalType === "add" ? "Thêm đánh giá" : "Cập nhật đánh giá"}
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
