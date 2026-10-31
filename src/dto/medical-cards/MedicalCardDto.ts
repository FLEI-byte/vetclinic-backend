export interface MedicalCardDto {
  client_id: number;
  nickname: string;
  species: string;
  breed: string;
  sex: string;
  birth_date: string;
  created_date?: string;
}
