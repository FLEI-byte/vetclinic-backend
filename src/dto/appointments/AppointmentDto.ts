export interface AppointmentDto {
  medical_card_id: number;
  employee_id: number;
  appointment_date: string;
  purpose: string;
  exam_results?: string;
  diagnosis?: string;
  total: number;
}
