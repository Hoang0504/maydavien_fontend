const validateProductForm = (
  product: {
    name: string;
    image: string;
    price: number;
    old_price: number;
    category_id: number;
    attributes: { name: string; value: string }[];
    images: string[];
    description: string;
  },
  type: string
) => {
  if (!product.name || product.name.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Tên sản phẩm phải có ít nhất 3 ký tự.",
    };
  }

  if (!product.image && type !== "edit") {
    return {
      isValid: false,
      errorMessage: "Ảnh sản phẩm không được để trống.",
    };
  }

  if (product.images.length < 1 && type !== "edit") {
    return {
      isValid: false,
      errorMessage: "Ảnh mô tả sản phẩm phải ít nhất 1 ảnh.",
    };
  }

  if (!product.price || product.price <= 0) {
    return {
      isValid: false,
      errorMessage: "Giá sản phẩm phải lớn hơn 0.",
    };
  }

  if (!product.old_price || product.old_price < product.price) {
    return {
      isValid: false,
      errorMessage: "Giá cũ phải lớn hơn hoặc bằng giá hiện tại.",
    };
  }

  if (!product.category_id || product.category_id <= 0) {
    return {
      isValid: false,
      errorMessage: "Vui lòng chọn danh mục sản phẩm.",
    };
  }

  if (!product.attributes || product.attributes.length === 0) {
    return {
      isValid: false,
      errorMessage: "Sản phẩm phải có ít nhất một thuộc tính.",
    };
  }

  for (const attr of product.attributes) {
    if (!attr.name || attr.name.trim().length < 3) {
      return {
        isValid: false,
        errorMessage: "Vui lòng chọn tên thuộc tính.",
      };
    }
    if (!attr.value || attr.value.trim().length < 3) {
      return {
        isValid: false,
        errorMessage: "Giá trị thuộc tính phải có ít nhất 3 ký tự.",
      };
    }
  }

  if (!product.description || product.description.trim().length < 10) {
    return {
      isValid: false,
      errorMessage: "Mô tả sản phẩm phải có ít nhất 10 ký tự.",
    };
  }

  return {
    isValid: true,
    data: {
      name: product.name,
      image: product.image,
      price: product.price,
      old_price: product.old_price,
      category_id: product.category_id,
      attributes: product.attributes.map((attr) => ({
        name: attr.name,
        value: attr.value,
      })),
      images: product.images.map((img) => img),
      description: product.description,
    },
    errorMessage: "",
  };
};

export default validateProductForm;
