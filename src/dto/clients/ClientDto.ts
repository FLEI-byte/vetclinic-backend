export interface ClientDto {
  phone: string;
  last_name: string;
  first_name: string;
  patronymic: string;
  birth_date: string;
  email: string;
}

const PHONE_REGEX = /^\+380\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateClientDto = (body: Partial<ClientDto>, partial = false): string[] => {
  const errors: string[] = [];
  const required: (keyof ClientDto)[] = ['phone', 'last_name', 'first_name', 'patronymic', 'birth_date', 'email'];

  required.forEach((field) => {
    const value = body[field];
    if (value === undefined) {
      if (!partial) errors.push(`${field} is required`);
    } else if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`${field} must be a non-empty string`);
    }
  });

  if (body.phone !== undefined && !PHONE_REGEX.test(body.phone)) {
    errors.push('phone must match +380XXXXXXXXX');
  }
  if (body.email !== undefined && (!EMAIL_REGEX.test(body.email) || body.email.length > 255)) {
    errors.push('email is invalid');
  }
  (['last_name', 'first_name', 'patronymic'] as const).forEach((field) => {
    const value = body[field];
    if (value !== undefined && typeof value === 'string' && value.length > 30) {
      errors.push(`${field} must be at most 30 characters`);
    }
  });
  if (body.birth_date !== undefined) {
    const date = new Date(body.birth_date);
    if (isNaN(date.getTime()) || date >= new Date()) {
      errors.push('birth_date must be a valid date in the past');
    }
  }

  return errors;
};
