import validator from 'validator';

const FIELDS = ['phone', 'last_name', 'first_name', 'patronymic', 'birth_date', 'email'];
const NAME_FIELDS = ['last_name', 'first_name', 'patronymic'];

export const checkClientBody = (body: any, partial: boolean): string[] => {
  const errors: string[] = [];

  FIELDS.forEach((field) => {
    const value = body[field];

    if (value === undefined) {
      if (!partial) errors.push(`${field} is required`);
      return;
    }
    if (typeof value !== 'string' || validator.isEmpty(value.trim())) {
      errors.push(`${field} must be a non-empty string`);
      return;
    }

    if (field === 'phone' && !validator.matches(value, /^\+380\d{9}$/)) {
      errors.push('phone must match +380XXXXXXXXX');
    }
    if (field === 'email' && (!validator.isEmail(value) || !validator.isLength(value, { max: 255 }))) {
      errors.push('email is invalid');
    }
    if (NAME_FIELDS.includes(field) && !validator.isLength(value, { max: 30 })) {
      errors.push(`${field} must be at most 30 characters`);
    }
    if (field === 'birth_date') {
      if (!validator.isDate(value, { format: 'YYYY-MM-DD', strictMode: true }) || new Date(value) >= new Date()) {
        errors.push('birth_date must be a valid date in the past (YYYY-MM-DD)');
      }
    }
  });

  return errors;
};
