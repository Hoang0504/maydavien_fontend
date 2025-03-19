const validateIntroduceForm = (
  title: string,
  subTitle: string,
  description: string,
  image: string,
  linkTitle: string,
  type: number,
  mode: string
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
      errorMessage: "Tiêu đề phụ phải có ít nhất 3 ký tự.",
    };
  }

  if (description.trim().length < 20) {
    return {
      isValid: false,
      errorMessage: "Mô tả phải có ít nhất 20 ký tự.",
    };
  }

  if (!image && mode !== "edit") {
    return { isValid: false, errorMessage: "Ảnh không được để trống." };
  }

  if (!linkTitle || linkTitle.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Tiêu đề liên kết phải có ít nhất 3 ký tự.",
    };
  }

  if (type !== 1 && type !== 2) {
    return {
      isValid: false,
      errorMessage: "Kiểu giới thiệu phải là 1 hoặc 2.",
    };
  }

  return {
    isValid: true,
    data: {
      title,
      sub_title: subTitle,
      description,
      image,
      link_title: linkTitle,
      type,
    },
    errorMessage: "",
  };
};

export default validateIntroduceForm;
