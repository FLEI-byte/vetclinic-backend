import validator from 'validator';

const REQUIRED_FIELDS = ['client_id', 'nickname', 'species', 'breed', 'sex', 'birth_date'];
const TEXT_FIELDS = ['nickname', 'species', 'breed'];
const SEX_VALUES = ['чоловіча', 'жіноча'];
const DATE_OPTIONS = { format: 'YYYY-MM-DD', strictMode: true };

export const checkMedicalCardBody = (body: any, partial: boolean): string[] => {
  const errors: string[] = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (body[field] === undefined && !partial) errors.push(`${field} is required`);
  });

  if (body.client_id !== undefined) {
    if (!Number.isInteger(body.client_id) || body.client_id <= 0) {
      errors.push('client_id must be a positive integer');
    }
  }

  TEXT_FIELDS.forEach((field) => {
    const value = body[field];
    if (value === undefined) return;
    if (typeof value !== 'string' || validator.isEmpty(value.trim())) {
      errors.push(`${field} must be a non-empty string`);
    } else if (!validator.isLength(value, { max: 50 })) {
      errors.push(`${field} must be at most 50 characters`);
    }
  });

  if (body.sex !== undefined && !SEX_VALUES.includes(body.sex)) {
    errors.push('sex must be one of: чоловіча, жіноча');
  }

  if (body.created_date !== undefined) {
    if (
      typeof body.created_date !== 'string' ||
      !validator.isDate(body.created_date, DATE_OPTIONS) ||
      new Date(body.created_date) > new Date()
    ) {
      errors.push('created_date must be a valid date not later than today (YYYY-MM-DD)');
    }
  }

  if (body.birth_date !== undefined) {
    if (typeof body.birth_date !== 'string' || !validator.isDate(body.birth_date, DATE_OPTIONS)) {
      errors.push('birth_date must be a valid date (YYYY-MM-DD)');
    } else {
      const created = typeof body.created_date === 'string' ? new Date(body.created_date) : new Date();
      if (new Date(body.birth_date) >= created) {
        errors.push('birth_date must be before the card creation date');
      }
    }
  }

  return errors;
};
