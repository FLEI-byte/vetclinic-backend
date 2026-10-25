export interface MedicalCardDto {
  client_id: number;
  nickname: string;
  species: string;
  breed: string;
  sex: string;
  birth_date: string;
  created_date?: string;
}

const SEX_VALUES = ['чоловіча', 'жіноча'];

export const validateMedicalCardDto = (body: Partial<MedicalCardDto>, partial = false): string[] => {
  const errors: string[] = [];
  const required: (keyof MedicalCardDto)[] = ['client_id', 'nickname', 'species', 'breed', 'sex', 'birth_date'];

  required.forEach((field) => {
    if (body[field] === undefined && !partial) errors.push(`${field} is required`);
  });

  if (body.client_id !== undefined && (!Number.isInteger(body.client_id) || body.client_id <= 0)) {
    errors.push('client_id must be a positive integer');
  }
  (['nickname', 'species', 'breed'] as const).forEach((field) => {
    const value = body[field];
    if (value !== undefined) {
      if (typeof value !== 'string' || value.trim() === '') errors.push(`${field} must be a non-empty string`);
      else if (value.length > 50) errors.push(`${field} must be at most 50 characters`);
    }
  });
  if (body.sex !== undefined && !SEX_VALUES.includes(body.sex)) {
    errors.push('sex must be one of: чоловіча, жіноча');
  }
  if (body.birth_date !== undefined) {
    const birth = new Date(body.birth_date);
    const created = body.created_date ? new Date(body.created_date) : new Date();
    if (isNaN(birth.getTime()) || birth >= created) {
      errors.push('birth_date must be a valid date before the card creation date');
    }
  }
  if (body.created_date !== undefined) {
    const created = new Date(body.created_date);
    if (isNaN(created.getTime()) || created > new Date()) {
      errors.push('created_date must be a valid date not later than today');
    }
  }

  return errors;
};
