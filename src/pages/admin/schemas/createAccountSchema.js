import * as yup from "yup";

export const createAccountSchema = yup.object().shape({
  firstName: yup.string().trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: yup.string().trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),
  phone: yup.string()
    .nullable()
    .notRequired()
    .test("is-valid-phone", "Phone number must contain only numbers and be 10-11 digits", (value) => {
      if (!value || value.trim() === "") return true;
      return /^[0-9]{10,11}$/.test(value);
    }),
  email: yup.string().trim()
    .email("Invalid email format")
    .required("Email is required")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email cannot exceed 100 characters"),
  role: yup.string().required("Role is required"),
  authorName: yup.string().when("role", {
    is: "mangaka",
    then: (schema) => schema.trim()
      .required("Author name is required")
      .min(2, "Author name must be at least 2 characters")
      .max(50, "Author name cannot exceed 50 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  supervisorId: yup.string().nullable().notRequired(),
  password: yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});
