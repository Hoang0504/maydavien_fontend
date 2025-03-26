"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  createProduct,
  deleteProduct,
  getProducts,
  restoreProduct,
  updateProduct,
} from "@/services/productService";

import { getFilenameAndExtension, normalizeObject } from "@/utils";
import { deleteImage, uploadImages } from "@/services/imageService";
import { Product } from "@/models/Product";
import { useAuthentication } from "@/context/authenticationContext";
import { validateProductForm, validateImageUpload } from "@/validates/admin";

import { Editor } from "@tinymce/tinymce-react";
import { getCategories } from "@/services/categoryService";
import { Category } from "@/models/Category";
import { getAttributes } from "@/services/attributeService";
import { Attribute } from "@/models/Attribute";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import NotFoundPage from "@/components/NotFoundPage";
import DialogTitle from "@/components/ui/DialogTitle";
import PaginationBar from "@/components/PaginationBar";
import DialogContent from "@/components/ui/DialogContent";

export default function ProductManagement() {
  const { adminToken, handleAdminLogout } = useAuthentication();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributesData, setAttributesData] = useState<Attribute[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modeData, setModeData] = useState("active");
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [oldPrice, setOldPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [attributes, setAttributes] = useState<
    { name: string; value: string }[]
  >([]);
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [newEditImage, setNewEditImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [newEditImages, setNewEditImages] = useState<string[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [deletedEditImages, setDeletedEditImages] = useState<string[]>([]);
  const [textError, setTextError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState<number>(0);

  const [hasHandled, setHasHandled] = useState<boolean>(false);

  const handleClickAddProductButton = () => {
    setModalType("add");
    setOpenModal(true);
    setName("");
    setPrice(0);
    setOldPrice(0);
    setImage("");
    setImages([]);
    setCategoryId(0);
    setAttributes([]);
    setDescription("");
    setImagePreview("");
    setImagesPreview([]);
    setTextError("");
  };

  const handleAttributeChange = (
    index: number,
    key: "name" | "value",
    value: string
  ) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, [key]: value } : attr))
    );
  };

  const handleAddAttribute = () => {
    setAttributes((prev) => [...prev, { name: "", value: "" }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomAttribute = () => {
    const customAttr = window.prompt("Enter the new attribute name:");

    if (!customAttr || customAttr.trim().length < 3) {
      setTextError("Tên thuộc tính phải có ít nhất 3 ký tự");
    } else {
      setAttributesData((prev) => [...prev, { name: customAttr }]);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    let response = null;

    if (modalType === "edit" && newEditImage) {
      response = await deleteImage(
        newEditImage,
        adminToken,
        "product",
        handleAdminLogout
      );
      if (response.error) {
        setTextError("Không thể xóa được ảnh này!");
        return;
      }
    } else if (modalType === "add" && image) {
      response = await deleteImage(
        image,
        adminToken,
        "product",
        handleAdminLogout
      );
      if (response.error) {
        setTextError("Không thể xóa được ảnh này!");
        return;
      }
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

  const handleMultipleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validation = validateImageUpload(Array.from(files));
    if (!validation.isValid) {
      setTextError(validation.errorMessage);
      return;
    }

    const response = await uploadImages(
      Array.from(files),
      adminToken,
      handleAdminLogout
    );

    if (response.error) {
      setTextError("Tải ảnh lên không thành công");
      return;
    }

    if (modalType === "edit") {
      setNewEditImages((prev) => [
        ...prev,
        ...response.files.map((file: string) => getFilenameAndExtension(file)),
      ]);
    } else {
      setImages((prev) => [
        ...prev,
        ...response.files.map((file: string) => getFilenameAndExtension(file)),
      ]);
    }

    setImagesPreview((prev) => [...prev, ...response.files]);
  };

  const handleClearImagePreview = async (
    indexImages?: number,
    deleteMainOnly?: boolean
  ) => {
    let response = { error: false };

    if (modalType === "edit") {
      if (deleteMainOnly) {
        // case 1: delete only the main image (newEditImage)
        if (newEditImage) {
          response = await deleteImage(
            newEditImage,
            adminToken,
            "product",
            handleAdminLogout
          );
        }
        setImagePreview("");
        setNewEditImage("");
      } else if (indexImages === undefined) {
        // case 3: delete all images (newEditImage & newEditImages)
        if (newEditImage) {
          response = await deleteImage(
            newEditImage,
            adminToken,
            "product",
            handleAdminLogout
          );
        }
        if (newEditImages.length > 0) {
          response = await deleteImage(
            newEditImages.join(","),
            adminToken,
            "product_image",
            handleAdminLogout
          );
        }
      } else {
        // case 2 delete a specific image from images
        const imageToDelete = imagesPreview[indexImages];

        if (!imageToDelete) return;

        const isNewImage = newEditImages.includes(
          getFilenameAndExtension(imageToDelete)
        );
        if (isNewImage) {
          response = await deleteImage(
            imageToDelete,
            adminToken,
            "product_image",
            handleAdminLogout
          );
          if (response) {
            setNewEditImages((prev) =>
              prev.filter((img) => img !== imageToDelete)
            );
          }
        } else {
          setDeletedEditImages((prev) => [
            ...prev,
            getFilenameAndExtension(imageToDelete),
          ]);
        }
      }
    } else if (modalType === "add") {
      if (deleteMainOnly) {
        // case 1: delete only the main image (image)
        if (image) {
          response = await deleteImage(
            image,
            adminToken,
            "product",
            handleAdminLogout
          );
          setImage("");
          setImagePreview("");
        }
      } else if (indexImages === undefined) {
        // case 3: delete all images (image & images)
        if (image) {
          response = await deleteImage(
            image,
            adminToken,
            "product",
            handleAdminLogout
          );
        }
        if (images.length > 0) {
          response = await deleteImage(
            images.join(","),
            adminToken,
            "product_image",
            handleAdminLogout
          );
        }
      } else {
        // case 2 delete a specific image from images
        const imageToDelete = images[indexImages];
        if (!imageToDelete) return;

        response = await deleteImage(
          getFilenameAndExtension(imageToDelete),
          adminToken,
          "product_image",
          handleAdminLogout
        );
        if (response) {
          setImagesPreview((prev) => prev.filter((_, i) => i !== indexImages));
          setImages((prev) => prev.filter((_, i) => i !== indexImages));
        }
      }
    }

    if (response.error) {
      setTextError("Không thể xóa được ảnh này!");
    } else {
      setTextError("");
    }
  };

  const handleSubmit = async () => {
    const validation = validateProductForm(
      {
        name,
        image: modalType === "edit" ? newEditImage : image,
        price,
        old_price: oldPrice,
        category_id: categoryId,
        attributes,
        images: modalType === "edit" ? newEditImages : images,
        description,
      },
      modalType
    );

    if (validation?.isValid) {
      let response = null;
      setTextError("");
      if (validation.data) {
        if (modalType === "add") {
          response = await createProduct(
            validation.data,
            adminToken,
            handleAdminLogout
          );
        } else if (modalType === "edit") {
          response = await updateProduct(
            { ...validation.data, deletedImages: deletedEditImages, id },
            adminToken,
            handleAdminLogout
          );
        }
      }
      if (response) {
        if (response.error) {
          if (response.message === "Product name already exists.") {
            setTextError("Tên sản phẩm đã tồn tại!");
            return;
          }
          handleClearImagePreview();
        } else {
          setOpenModal(false);
          setHasHandled(true);
          if (page === 1 && modeData === "active") {
            fetchProductsData();
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

  const handleRestore = async (productId: number) => {
    const response = await restoreProduct(
      productId,
      adminToken,
      handleAdminLogout
    );
    if (response) {
      setPage(1);
      setModeData("active");
    }
  };

  const handleDelete = async (model: string) => {
    const response = await deleteProduct(
      id,
      adminToken,
      model,
      handleAdminLogout
    );
    if (response) {
      setOpenModal(false);
      if (page === 1 && modeData === "active") {
        fetchProductsData();
      } else {
        setPage(1);
        setModeData("active");
      }
    }
  };

  const openEditModal = (product: Product) => {
    setId(product.id || 0);
    setName(product.name);
    setPrice(product.price);
    setOldPrice(product.old_price);

    setImage(getFilenameAndExtension(product.image));
    setCategoryId(product?.category?.id || 0);
    setAttributes(product.attributes);
    setImages(product.images);
    setDescription(product.description);
    setNewEditImage("");
    setNewEditImages([]);
    setDeletedEditImages([]);

    setImagePreview(product.image);
    setImagesPreview(product.images);
    setTextError("");
    setModalType("edit");
    setOpenModal(true);
  };

  const handleSetDeleteState = (product: Product, modalType: string) => {
    setId(product.id || 0);
    setName(product.name);
    setModalType(modalType);
    setOpenModal(true);
  };

  const handleCancel = () => {
    if (modalType === "add" && (image || images.length > 0)) {
      handleClearImagePreview();
    } else if (modalType === "edit" && (newEditImage || newEditImages)) {
      handleClearImagePreview();
    }
    setOpenModal(false);

    setHasHandled(true);
  };

  const fetchProductsData = async (mode: string = "active") => {
    const response = await getProducts({
      page: page.toString(),
      pageSize: pageSize.toString(),
      mode,
    });

    const normalizedData = normalizeObject(
      response.data
    ) as unknown as Product[];
    setProducts(normalizedData);
    setTotalPages(
      response.total_pages ? parseInt(response.total_pages.toString()) : 0
    );
  };

  const fetchCategoriesData = async (mode: string = "all-active") => {
    const response = await getCategories({
      mode,
    });

    const normalizedData = normalizeObject(
      response.data
    ) as unknown as Category[];
    setCategories(normalizedData);
  };

  const fetchAttributesData = async (mode: string = "all-active") => {
    const response = await getAttributes(
      {
        mode,
      },
      adminToken,
      handleAdminLogout
    );

    const normalizedData = normalizeObject(
      response.data
    ) as unknown as Attribute[];
    setAttributesData(normalizedData);
  };

  useEffect(() => {
    fetchProductsData(modeData);
  }, [page, modeData]);

  useEffect(() => {
    fetchCategoriesData();
    fetchAttributesData();
  }, []);

  useEffect(() => {
    if (openModal) {
      setHasHandled(false);
    }

    if (!openModal && !hasHandled) {
      handleCancel();
    }
  }, [openModal]);

  if (!products) return <NotFoundPage />;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
      <Button className="mb-4" onClick={handleClickAddProductButton}>
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
        Sản phẩm có sẵn
      </Button>
      <Button
        className="mb-4 ml-4"
        variant="destructive"
        onClick={() => {
          setPage(1);
          setModeData("inactive");
        }}
      >
        Sản phẩm đã xóa tạm thời
      </Button>
      <table className="w-full max-w-full text-left table-auto">
        <thead>
          <tr>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Mã sản phẩm
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">Tên</th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Nội dung
            </th>
            <th className="p-4 border-b border-slate-300 bg-slate-50">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className={"hover:bg-slate-50 bg-white text-gray-400"}
            >
              <td className="p-4 border-b border-slate-200">{product.id}</td>
              <td className="p-4 border-b border-slate-200">{product.name}</td>
              <td className="p-4 border-b border-slate-200">
                <div
                  className="line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </td>
              <td className="p-4 border-b border-slate-200">
                {product.status ? (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => openEditModal(product)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      className="mr-2"
                      variant="destructive"
                      onClick={() => handleSetDeleteState(product, "delete")}
                    >
                      Xóa tạm thời
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => handleRestore(product.id || 0)}
                    >
                      Khôi phục
                    </Button>
                    <Button
                      className="mr-2"
                      variant="destructive"
                      onClick={() =>
                        handleSetDeleteState(product, "delete-force")
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
            {modalType === "add" && "Thêm sản phẩm"}
            {modalType === "edit" && "Chỉnh sửa sản phẩm"}
            {modalType === "delete" && "Xác nhận xóa"}
          </DialogTitle>
          <div className="p-4">
            {(modalType === "add" || modalType === "edit") && (
              <form className="space-y-6 p-6 bg-white shadow-lg rounded-lg">
                {textError && <div className="text-red-500">{textError}</div>}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên sản phẩm
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Chọn ảnh chính
                  </label>
                  <input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  {imagePreview && (
                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium text-gray-700">
                        Xem thử ảnh
                      </label>
                      <div className="w-[100px] h-[100px] bg-gray-100 rounded-md overflow-hidden relative">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleClearImagePreview(undefined, true)
                          } // Clear the preview when clicked
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
                </div>

                <div>
                  <label
                    htmlFor="images"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hình ảnh mô tả sản phẩm
                  </label>
                  <input
                    id="images"
                    type="file"
                    multiple
                    onChange={handleMultipleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex flex-wrap gap-2">
                    {imagesPreview.map((img: string, i: number) => (
                      <div
                        key={i}
                        className="w-[100px] h-[100px] bg-gray-100 rounded-md overflow-hidden relative"
                      >
                        <Image
                          src={img}
                          alt="Preview"
                          fill
                          className="aspect-square object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleClearImagePreview(i)}
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
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Giá khuyến mãi
                    </label>
                    <input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="oldPrice"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Giá cũ
                    </label>
                    <input
                      id="oldPrice"
                      type="number"
                      value={oldPrice}
                      onChange={(e) => setOldPrice(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Danh mục
                  </label>
                  <select
                    id="category"
                    defaultValue={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category, i) => (
                      <option key={i} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thuộc tính
                  </label>
                  <div>
                    {attributes.map((attr, idx) => {
                      return (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                          <div className="grid grid-cols-2 gap-4 flex-1">
                            <select
                              defaultValue={attr.name}
                              onChange={(e) => {
                                if (e.target.value === "add_custom") {
                                  handleAddCustomAttribute();
                                } else {
                                  handleAttributeChange(
                                    idx,
                                    "name",
                                    e.target.value
                                  );
                                }
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Tên thuộc tính</option>
                              {attributesData.map((item, i) => (
                                <option key={i} value={item.name}>
                                  {item.name}
                                </option>
                              ))}
                              <option value="add_custom">
                                + Thêm thuộc tính
                              </option>
                            </select>
                            <input
                              type="text"
                              value={attr.value}
                              onChange={(e) =>
                                handleAttributeChange(
                                  idx,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                          </div>
                          <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => handleRemoveAttribute(idx)}
                            className="text-red-500 hover:opacity-75 cursor-pointer p-2"
                          />
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Thêm thuộc tính
                    </button>
                  </div>
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
              </form>
            )}
            {(modalType === "delete" || modalType === "delete-force") && (
              <p>
                Bạn có chắc chắn muốn xóa sản phẩm {name}{" "}
                {modalType === "delete-force" && "viễn viễn"} không?
              </p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              {(modalType === "add" || modalType === "edit") && (
                <Button variant="green" onClick={handleSubmit}>
                  {modalType === "add" ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
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
