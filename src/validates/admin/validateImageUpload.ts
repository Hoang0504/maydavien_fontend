// validation.ts
const validateImageUpload = (image: File | null) => {
  if (!image) {
    return { isValid: false, errorMessage: "Image is required." };
  }

  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!allowedImageTypes.includes(image.type)) {
    return {
      isValid: false,
      errorMessage:
        "Định dạng ảnh tải lên không hợp lệ. Chỉ những ảnh có đuôi JPEG, PNG, GIF, and WEBP mới được cho phép.",
    };
  }

  return { isValid: true, errorMessage: "" };
};

export default validateImageUpload;
