const validateCategoryForm = (
  name: string,
  image: string,
  description: string,
  type: string
) => {
  if (!name || name.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Tiêu đề phải có ít nhất 3 ký tự.",
    };
  }

  if (description.trim().length < 20) {
    return {
      isValid: false,
      errorMessage: "Mô tả phải có ít nhất 20 ký tự.",
    };
  }

  if (!image && type !== "edit") {
    return { isValid: false, errorMessage: "Ảnh không được để trống." };
  }

  return {
    isValid: true,
    data: {
      name,
      image,
      description,
    },
    errorMessage: "",
  };
};

export default validateCategoryForm;
