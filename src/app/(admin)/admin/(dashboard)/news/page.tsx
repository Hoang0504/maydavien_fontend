"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";

import {
  createNews,
  deleteNews,
  getNews,
  restoreNews,
  updateNews,
} from "@/services/newsService";

import { getFilenameAndExtension, normalizeObject } from "@/utils";
import { deleteImage, uploadImages } from "@/services/imageService";
import { News } from "@/models/News";
import { useAuthentication } from "@/context/authenticationContext";
import { validateNewsForm, validateImageUpload } from "@/validates/admin";

import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import NotFoundPage from "@/components/NotFoundPage";
import DialogTitle from "@/components/ui/DialogTitle";
import PaginationBar from "@/components/PaginationBar";
import DialogContent from "@/components/ui/DialogContent";

export default function NewsManagement() {
  const { adminToken, handleAdminLogout } = useAuthentication();
  const [news, setNews] = useState<News[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modeData, setModeData] = useState("active");
  const [id, setId] = useState(0);
  const [title, setName] = useState("");
  const [image, setImage] = useState<string>("");
  const [content, setContent] = useState("");
  const [newEditImage, setNewEditImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [textError, setTextError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState<number>(0);

  const [hasHandled, setHasHandled] = useState<boolean>(false);

  const handleClickAddNewsButton = () => {
    setModalType("add");
    setOpenModal(true);
    setName("");
    setContent("");
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
        "news",
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
        "news",
        handleAdminLogout
      );
    } else if (modalType === "add" && image) {
      response = await deleteImage(
        image,
        adminToken,
        "news",
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
    const validation = validateNewsForm(
      title,
      modalType === "edit" ? newEditImage : image,
      content,
      modalType
    );
    if (validation?.isValid) {
      let response = null;
      setTextError("");
      if (validation.data) {
        if (modalType === "add") {
          response = await createNews(
            validation.data,
            adminToken,
            handleAdminLogout
          );
        } else if (modalType === "edit") {
          response = await updateNews(
            { ...validation.data, id },
            adminToken,
            handleAdminLogout
          );
        }
      }
      if (response) {
        if (response.error) {
          if (response.message === "News title already exists.") {
            setTextError("Tiêu đề bài viết đã tồn tại!");
            return;
          }
          handleClearImagePreview();
        } else {
          setOpenModal(false);
          setHasHandled(true);
          if (page === 1 && modeData === "active") {
            fetchNewsData();
          } else {
            setPage(1);
            setModeData("active");
          }
        }
      } else {
        setTextError("Thao tác không thành công!");
      }
    } else {
      setTextError(validation?.errorMessage || "");
    }
  };

  const handleRestore = async (newsId: number) => {
    const response = await restoreNews(newsId, adminToken, handleAdminLogout);
    if (response) {
      setPage(1);
      setModeData("active");
    }
  };

  const handleDelete = async (model: string) => {
    const response = await deleteNews(id, adminToken, model, handleAdminLogout);
    if (response) {
      setOpenModal(false);
      if (page === 1 && modeData === "active") {
        fetchNewsData();
      } else {
        setPage(1);
        setModeData("active");
      }
    }
  };

  const openEditModal = (news: News) => {
    setId(news.id || 0);
    setName(news.title);
    setContent(news.content);
    setImage(getFilenameAndExtension(news.image));
    setNewEditImage("");

    setImagePreview(news.image);
    setTextError("");
    setModalType("edit");
    setOpenModal(true);
  };

  const handleSetDeleteState = (news: News, modalType: string) => {
    setId(news.id || 0);
    setName(news.title);
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

  const fetchNewsData = async (mode: string = "active") => {
    const response = await getNews({
      page: page.toString(),
      pageSize: pageSize.toString(),
      mode,
    });
    const normalizedData = normalizeObject(response.data) as unknown as News[];
    setNews(normalizedData);
    setTotalPages(
      response.total_pages ? parseInt(response.total_pages.toString()) : 0
    );
  };

  useEffect(() => {
    fetchNewsData(modeData);
  }, [page, modeData]);

  useEffect(() => {
    if (openModal) {
      setHasHandled(false);
    }

    if (!openModal && !hasHandled) {
      handleCancel();
    }
  }, [openModal]);

  if (!news) return <NotFoundPage />;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý bài viết</h1>
      <Button className="mb-4" onClick={handleClickAddNewsButton}>
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
        Bài viết có sẵn
      </Button>
      <Button
        className="mb-4 ml-4"
        variant="destructive"
        onClick={() => {
          setPage(1);
          setModeData("inactive");
        }}
      >
        Bài viết đã xóa tạm thời
      </Button>
      <table className="w-full max-w-full text-left table-auto">
        <thead>
          <tr>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Mã bài viết
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Tiêu đề bài viết
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Nội dung bài viết
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {news.map((newsItem) => (
            <tr
              key={newsItem.id}
              className={"hover:bg-slate-50 bg-white text-gray-400"}
            >
              <td className="p-4 border-b border-slate-200">{newsItem.id}</td>
              <td className="p-4 border-b border-slate-200">
                {newsItem.title}
              </td>
              <td className="p-4 border-b border-slate-200">
                <div
                  className="line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: newsItem.content }}
                />
              </td>
              <td className="p-4 border-b border-slate-200">
                {newsItem.status ? (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => openEditModal(newsItem)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      className="mr-2"
                      variant="destructive"
                      onClick={() => handleSetDeleteState(newsItem, "delete")}
                    >
                      Xóa tạm thời
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => handleRestore(newsItem.id || 0)}
                    >
                      Khôi phục
                    </Button>
                    <Button
                      className="mr-2"
                      variant="destructive"
                      onClick={() =>
                        handleSetDeleteState(newsItem, "delete-force")
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
            {modalType === "add" && "Thêm bài viết"}
            {modalType === "edit" && "Chỉnh sửa bài viết"}
            {modalType === "delete" && "Xác nhận xóa"}
          </DialogTitle>
          <div className="p-4">
            {(modalType === "add" || modalType === "edit") && (
              <form>
                {textError && <div className="text-red-500">{textError}</div>}

                {/* Name */}
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
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề"
                  />
                </div>

                {/* Image */}
                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ảnh bài viết
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
                        onClick={handleClearImagePreview}
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

                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mô tả
                  </label>
                  <Editor
                    apiKey="v5pij1okvrobhmxz0xowm11k3o9ftcmbxpm3cqsjhk56y0ac"
                    value={content}
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
                    onEditorChange={setContent}
                  />
                </div>
              </form>
            )}
            {(modalType === "delete" || modalType === "delete-force") && (
              <p>
                Bạn có chắc chắn muốn xóa bài viết {title}{" "}
                {modalType === "delete-force" && "viễn viễn"} không?
              </p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              {(modalType === "add" || modalType === "edit") && (
                <Button variant="green" onClick={handleSubmit}>
                  {modalType === "add" ? "Thêm bài viết" : "Cập nhật bài viết"}
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
