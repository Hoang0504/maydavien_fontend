const validateLoginForm = (username: string, password: string) => {
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex

  if (!username || username.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Tên đăng nhập phải có ít nhất 3 ký tự.",
    };
  }

  // if (!emailRegex.test(email)) {
  //   return {
  //     isValid: false,
  //     errorMessage: "Email không đúng định dạng.",
  //   };
  // }

  if (!password || password.trim().length < 6) {
    return {
      isValid: false,
      errorMessage: "Mật khẩu phải có ít nhất 6 ký tự.",
    };
  }

  return { isValid: true, errorMessage: "" };
};

export default validateLoginForm;
