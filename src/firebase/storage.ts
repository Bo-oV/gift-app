import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./config";

const storage = getStorage(app);

export const uploadAvatar = async (file: File, uid: string) => {
  const storageRef = ref(storage, `avatars/${uid}`);

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  return url;
};
