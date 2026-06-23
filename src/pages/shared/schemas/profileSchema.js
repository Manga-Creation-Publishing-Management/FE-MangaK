import * as yup from "yup";

export const profileSchema = yup.object().shape({
  firstName: yup.string().trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: yup.string().trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),
  email: yup.string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email cannot exceed 100 characters"),
  phone: yup.string()
    .nullable()
    .notRequired()
    .test("is-valid-phone", "Phone number must contain only numbers and be 10-11 digits", (value) => {
      if (!value || value.trim() === "") return true;
      return /^[0-9]{10,11}$/.test(value);
    }),
  bio: yup.string().max(500, "Bio cannot exceed 500 characters").nullable(),
  authorName: yup.string().trim()
    .nullable()
    .notRequired()
    .test("min-len", "Author name must be at least 2 characters", (value) => {
      if (!value || value.trim() === "") return true;
      return value.trim().length >= 2;
    })
    .max(50, "Author name cannot exceed 50 characters"),
});
