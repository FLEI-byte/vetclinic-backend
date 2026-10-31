import validator from 'validator';

const REQUIRED_FIELDS = ['medical_card_id', 'employee_id', 'appointment_date', 'purpose', 'total'];
const ID_FIELDS = ['medical_card_id', 'employee_id'];

export const checkAppointmentBody = (body: any, partial: boolean): string[] => {
  const errors: string[] = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (body[field] === undefined && !partial) errors.push(`${field} is required`);
  });

  ID_FIELDS.forEach((field) => {
    const value = body[field];
    if (value !== undefined && (!Number.isInteger(value) || value <= 0)) {
      errors.push(`${field} must be a positive integer`);
    }
  });

  if (body.appointment_date !== undefined) {
    if (typeof body.appointment_date !== 'string' || isNaN(new Date(body.appointment_date).getTime())) {
      errors.push('appointment_date must be a valid date');
    }
  }

  if (body.purpose !== undefined) {
    if (typeof body.purpose !== 'string' || validator.isEmpty(body.purpose.trim())) {
      errors.push('purpose must be a non-empty string');
    }
  }

  if (body.exam_results !== undefined && typeof body.exam_results !== 'string') {
    errors.push('exam_results must be a string');
  }

  if (body.diagnosis !== undefined) {
    if (typeof body.diagnosis !== 'string') {
      errors.push('diagnosis must be a string');
    } else if (!validator.isLength(body.diagnosis, { max: 255 })) {
      errors.push('diagnosis must be at most 255 characters');
    }
  }

  if (body.total !== undefined) {
    if (typeof body.total !== 'number' || !validator.isFloat(String(body.total), { gt: 0 })) {
      errors.push('total must be a number greater than 0');
    }
  }

  return errors;
};
