const validateBannerForm = (
  title: string,
  subTitle: string,
  image: string,
  type: string
) => {
  if (!title || title.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Tiêu đề phải có ít nhất 3 ký tự.",
    };
  }

  if (subTitle && subTitle.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Phụ đề phải có ít nhất 3 ký tự.",
    };
  }

  if (!image && type !== "edit") {
    return { isValid: false, errorMessage: "Ảnh không được để trống." };
  }

  return {
    isValid: true,
    data: {
      title,
      sub_title: subTitle, // Convert subTitle to sub_title
      image,
    },
    errorMessage: "",
  };
};

export default validateBannerForm;
