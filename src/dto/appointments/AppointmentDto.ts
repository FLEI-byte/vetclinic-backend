export interface AppointmentDto {
  medical_card_id: number;
  employee_id: number;
  appointment_date: string;
  purpose: string;
  exam_results?: string;
  diagnosis?: string;
  total: number;
}

export const validateAppointmentDto = (body: Partial<AppointmentDto>, partial = false): string[] => {
  const errors: string[] = [];
  const required: (keyof AppointmentDto)[] = ['medical_card_id', 'employee_id', 'appointment_date', 'purpose', 'total'];

  required.forEach((field) => {
    if (body[field] === undefined && !partial) errors.push(`${field} is required`);
  });

  (['medical_card_id', 'employee_id'] as const).forEach((field) => {
    const value = body[field];
    if (value !== undefined && (!Number.isInteger(value) || value <= 0)) {
      errors.push(`${field} must be a positive integer`);
    }
  });
  if (body.appointment_date !== undefined && isNaN(new Date(body.appointment_date).getTime())) {
    errors.push('appointment_date must be a valid date');
  }
  if (body.purpose !== undefined && (typeof body.purpose !== 'string' || body.purpose.trim() === '')) {
    errors.push('purpose must be a non-empty string');
  }
  if (body.exam_results !== undefined && typeof body.exam_results !== 'string') {
    errors.push('exam_results must be a string');
  }
  if (body.diagnosis !== undefined) {
    if (typeof body.diagnosis !== 'string') errors.push('diagnosis must be a string');
    else if (body.diagnosis.length > 255) errors.push('diagnosis must be at most 255 characters');
  }
  if (body.total !== undefined && (typeof body.total !== 'number' || body.total <= 0)) {
    errors.push('total must be a number greater than 0');
  }

  return errors;
};
