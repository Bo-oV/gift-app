export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "avatar_upload"); // твій preset

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dgpa5gxwf/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await res.json();

  return data.secure_url;
};
