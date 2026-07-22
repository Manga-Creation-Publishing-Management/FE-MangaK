import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { userService } from "../../services/userService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "../../shared/hooks/useToast";

import { profileSchema } from "./schemas/profileSchema";
import { AvatarSection } from "./components/AvatarSection";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { ConfirmUpdateModal } from "./components/ConfirmUpdateModal";
import { SuccessModal } from "./components/SuccessModal";
import { Breadcrumb } from "@/shared/components/Breadcrumb";

export function ProfilePage() {
  const { showAlert } = useToast();
  const location = useLocation();

  const role = location.pathname.includes("mangaka")
    ? "mangaka"
    : location.pathname.includes("assistant")
      ? "assistant"
      : location.pathname.includes("tantou")
        ? "tantou"
        : location.pathname.includes("admin")
          ? "admin"
          : "editorial";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bio: "",
      authorName: "",
    },
  });

  const watchedFirstName = watch("firstName");
  const watchedLastName = watch("lastName");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await userService.getProfile();
      if (res) {
        const data = res.data;
        reset({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          authorName: data.authorName || "",
        });
        setAvatarUrl(data.avatarUrl || "");
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onFormSubmit = (data) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  const handleSaveProfile = async () => {
    if (!pendingData) return;
    try {
      setIsSaving(true);
      setShowConfirmModal(false);

      const formData = new FormData();
      formData.append("FirstName", pendingData.firstName);
      formData.append("LastName", pendingData.lastName);
      formData.append("Phone", pendingData.phone || "");
      formData.append("Bio", pendingData.bio || "");
      if (role === "mangaka") {
        formData.append("AuthorName", pendingData.authorName || "");
      }

      if (avatarFile) {
        formData.append("AvatarFile", avatarFile);
      }

      await userService.updateProfile(formData);
      await fetchProfile();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
      showAlert("Failed to update profile: " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const customBreadcrumb = [
    { label: role.charAt(0).toUpperCase() + role.slice(1), path: `/${role}` },
    { label: "Profile" }
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={customBreadcrumb} />

      <div className="bg-card border border-border rounded-xl p-8 space-y-8 shadow-xs">
        <AvatarSection
          isLoading={isLoading}
          avatarPreview={avatarPreview}
          avatarUrl={avatarUrl}
          watchedFirstName={watchedFirstName}
          watchedLastName={watchedLastName}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          triggerFileInput={triggerFileInput}
          role={role}
        />

        <div className="border-t border-border/60 pt-6">
          <PersonalInfoForm
            register={register}
            errors={errors}
            role={role}
            isSaving={isSaving}
            onSubmit={handleSubmit(onFormSubmit)}
          />
        </div>
      </div>

      <ConfirmUpdateModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSaveProfile}
      />

      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
