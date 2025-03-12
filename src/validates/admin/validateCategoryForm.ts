import { encodeString } from "@/utils";

const validateCategoryForm = (
  name: string,
  image: string | null,
  description: string
) => {
  if (!name || name.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Tiêu đề phải có ít nhất 3 ký tự.",
    };
  }

  if (!image) {
    return { isValid: false, errorMessage: "Ảnh không được để trống." };
  }

  if (description.trim().length < 20) {
    return {
      isValid: false,
      errorMessage: "Phụ đề phải có ít nhất 20 ký tự.",
    };
  }

  return {
    isValid: true,
    data: {
      name: encodeString(name),
      image: encodeString(image),
      description: encodeString(description),
    },
    errorMessage: "",
  };
};

export default validateCategoryForm;
