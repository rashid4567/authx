import { useState } from "react";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validators = {
  name: (value) => {
    if (!value?.trim()) return "Name is required";
    const trimmed = value.trim();
    if (trimmed.length < 2) return "Name must be at least 2 characters";
    if (trimmed.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) return "Invalid characters in name";
    return null;
  },

  email: (value) => {
    if (!value?.trim()) return "Email is required";
    if (!EMAIL_REGEX.test(value.trim())) return "Invalid email address";
    return null;
  },

  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  },

  confirmPassword: (value, original) => {
    if (!value) return "Confirm password required";
    if (value !== original) return "Passwords do not match";
    return null;
  },

  currentPassword: (value) => {
    if (!value) return "Current password is required";
    return null;
  },

  newPassword: (value) => {
    if (!value) return "New password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  },
};

const validateField = (name, value, extra) =>
  validators[name]?.(value, extra) || null;

const validateForm = (data, fields, extras = {}) => {
  return fields.reduce((errs, field) => {
    const err = validateField(field, data[field], extras[field]);
    if (err) errs[field] = err;
    return errs;
  }, {});
};

export const useFormValidation = (initialData = {}, fields = []) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const extra = name === "confirmPassword" ? formData.password : undefined;
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, extra),
      }));
    }
  
    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", formData.confirmPassword, value),
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const extra = name === "confirmPassword" ? formData.password : undefined;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name], extra),
    }));
  };

  const validateAll = () => {
    const extras = { confirmPassword: formData.password };
    const formErrors = validateForm(formData, fields, extras);
    setErrors(formErrors);
    setTouched(fields.reduce((acc, f) => ({ ...acc, [f]: true }), {}));
    return formErrors;
  };

  const reset = (newData = initialData) => {
    setFormData(newData);
    setErrors({});
    setTouched({});
  };

  const isValid = () => {
    
    const extras = { confirmPassword: formData.password };
    const formErrors = validateForm(formData, fields, extras);
    return Object.keys(formErrors).length === 0;
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid,
  };
};

export const getValidationRules = (formType) => {
  const rules = {
    login: ["email", "password"],
    register: ["name", "email", "password", "confirmPassword"],
    addUser: ["name", "email", "password"],
    editUser: ["name", "email"],
    changePassword: ["currentPassword", "newPassword"],
    updateProfile: ["name", "email", "currentPassword", "newPassword"],
  };
  return rules[formType] || [];
};