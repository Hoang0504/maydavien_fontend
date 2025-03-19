const validateLoginForm = (username: string, password: string) => {
  if (!username || username.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Tên đăng nhập phải có ít nhất 3 ký tự.",
    };
  }

  if (!password || password.trim().length < 6) {
    return {
      isValid: false,
      errorMessage: "Mật khẩu phải có ít nhất 6 ký tự.",
    };
  }

  return { isValid: true, errorMessage: "" };
};

export default validateLoginForm;
