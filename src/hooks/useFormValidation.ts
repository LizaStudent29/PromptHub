import { useState, useCallback } from "react";

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  custom?: (value: string) => string | null;
}

interface FieldConfig {
  [key: string]: ValidationRule;
}

interface Errors {
  [key: string]: string;
}

export function useFormValidation(fields: FieldConfig) {
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback(
    (name: string, value: string): string | null => {
      const rules = fields[name];
      if (!rules) return null;

      if (rules.required && !value.trim()) {
        return "Поле обязательно для заполнения";
      }

      if (rules.minLength && value.trim().length < rules.minLength) {
        return `Минимум ${rules.minLength} символов`;
      }

      if (rules.maxLength && value.trim().length > rules.maxLength) {
        return `Максимум ${rules.maxLength} символов`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.patternMessage || "Неверный формат";
      }

      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [fields]
  );

  const validate = useCallback(
    (values: { [key: string]: string }): boolean => {
      const newErrors: Errors = {};
      let isValid = true;

      for (const [name, value] of Object.entries(values)) {
        const error = validateField(name, value);
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      }

      setErrors(newErrors);
      return isValid;
    },
    [validateField]
  );

  const validateSingle = useCallback(
    (name: string, value: string) => {
      const error = validateField(name, value);
      setErrors((prev) => {
        if (error) return { ...prev, [name]: error };
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    [validateField]
  );

  const touchField = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    touched,
    validate,
    validateSingle,
    touchField,
    reset,
    isValid,
    setErrors,
  };
}
