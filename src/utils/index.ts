export const getImageResource = (imageUrl: string) => {
  if (imageUrl && imageUrl.startsWith("http")) return imageUrl;
  // console.log(imageUrl);

  return `https://lh3.googleusercontent.com/d/${imageUrl}`;
};
