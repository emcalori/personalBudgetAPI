import Ajv, { ValidateFunction } from "ajv";

interface ValidationResult {
  isValid: boolean;
  errors?: ValidateFunction["errors"];
}

export const validate = (schema: object, data: any): ValidationResult => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  return {
    isValid,
    errors: isValid ? undefined : validate.errors,
  };
};
