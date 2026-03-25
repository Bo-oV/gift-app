import { useEffect, useState } from "react";

import "./profile.scss";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { useAuth } from "@/context/useAuth";
import { updateUserProfile } from "@/firebase/firestore";
import { useUserProfile } from "@/context/UserContext";
import { LogOut, Pencil, Save } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { ConfirmModal } from "./components/ConfirmModal";

const getPhotoKey = (uid: string) => `user_photo_${uid}`;

export const Profile = () => {
  const { user } = useAuth();
  const { profile, setProfile } = useUserProfile();
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  // компресія
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 300;
        const scale = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressed);
      };

      reader.readAsDataURL(file);
    });
  };

  // ініціалізація з context
  useEffect(() => {
    if (!user) return;

    const savedPhoto = localStorage.getItem(getPhotoKey(user.uid));

    setName(profile?.displayName || user.displayName || "");
    setPhoto(profile?.photoURL || savedPhoto || user.photoURL || null);
  }, [user, profile]);

  const initialName = profile?.displayName || user?.displayName || "";
  const initialPhoto =
    profile?.photoURL ||
    (user && localStorage.getItem(getPhotoKey(user.uid))) ||
    user?.photoURL ||
    null;

  const isChanged = name !== initialName || photo !== initialPhoto;

  // вибір фото
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressed = await compressImage(file);
    setPhoto(compressed);
  };

  // cancel
  const handleCancel = () => {
    setName(initialName);
    setPhoto(initialPhoto);
  };

  // save
  const handleSave = async () => {
    if (!user) return;

    // зберігаємо фото локально
    if (photo) {
      localStorage.setItem(getPhotoKey(user.uid), photo);
    }

    // зберігаємо імʼя в Firestore
    await updateUserProfile(user.uid, {
      displayName: name,
    });

    // ОНОВЛЮЄМО STATE
    setProfile({
      displayName: name,
      photoURL: photo,
    });
  };

  // out
  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="profile">
      <div className="profile__header">
        <Button
          icon={<LogOut size={12} />}
          text="Вийти"
          variant="ghost"
          onClick={handleLogoutClick}
        />
      </div>
      <div className="profile__avatar">
        <img
          src={photo || `https://ui-avatars.com/api/?name=${name || "User"}`}
          alt="avatar"
        />

        <label className="profile__avatar-edit">
          <Pencil size={12} />
          <input type="file" onChange={handleFile} hidden />
        </label>
      </div>

      <Input
        label="Ім'я користувача"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="profile__actions">
        <Button
          text="Скасувати"
          variant="ghost"
          disabled={!isChanged}
          onClick={handleCancel}
        />

        <Button
          icon={<Save size={16} />}
          text="Зберегти"
          variant="secondary"
          disabled={!isChanged}
          onClick={handleSave}
        />
      </div>
      {showConfirm && (
        <ConfirmModal
          title="Вихід"
          text="Ви впевнені, що хочете вийти з профілю?"
          confirmText="Вийти"
          cancelText="Скасувати"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};
