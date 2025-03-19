const validateNewsForm = (
  title: string,
  image: string,
  content: string,
  type: string
) => {
  if (!title || title.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Tiêu đề phải có ít nhất 3 ký tự.",
    };
  }

  if (!image && type !== "edit") {
    return {
      isValid: false,
      errorMessage: "Ảnh bài viết không được để trống.",
    };
  }

  if (content.trim().length < 10) {
    return {
      isValid: false,
      errorMessage: "Nội dung bài viết phải có ít nhất 10 ký tự.",
    };
  }

  return {
    isValid: true,
    data: {
      title,
      image,
      content,
    },
    errorMessage: "",
  };
};

export default validateNewsForm;
