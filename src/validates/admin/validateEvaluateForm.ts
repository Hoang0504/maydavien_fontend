import { emailRegex, encodeString } from "@/utils";

const validateEvaluateForm = (
  name: string,
  avatar: string,
  rate: number,
  email: string,
  content: string
) => {
  if (!name || name.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Tên phải có ít nhất 3 ký tự.",
    };
  }

  if (!avatar) {
    return {
      isValid: false,
      errorMessage: "Ảnh đại diện không được để trống.",
    };
  }

  if (rate < 1 || rate > 5) {
    return {
      isValid: false,
      errorMessage: "Số lượng sao đánh giá không hợp lệ.",
    };
  }

  if (!email || !emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: "Email không hợp lệ.",
    };
  }

  if (content.trim().length < 5) {
    return {
      isValid: false,
      errorMessage: "Nội dung đánh giá phải có ít nhất 5 ký tự.",
    };
  }

  return {
    isValid: true,
    data: {
      name: encodeString(name),
      avatar: encodeString(avatar),
      rate,
      email: encodeString(email),
      content: encodeString(content),
    },
    errorMessage: "",
  };
};

export default validateEvaluateForm;
