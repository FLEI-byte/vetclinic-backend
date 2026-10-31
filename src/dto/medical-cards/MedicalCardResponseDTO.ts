import { MedicalCard } from 'orm/entities/medical-cards/MedicalCard';

import { AppointmentShortDTO } from '../shared/AppointmentShortDTO';
import { ClientShortDTO } from '../shared/ClientShortDTO';

export class MedicalCardResponseDTO {
  id: number;
  nickname: string;
  species: string;
  breed: string;
  sex: string;
  birth_date: string;
  created_date: string;
  client?: ClientShortDTO;
  appointments?: AppointmentShortDTO[];

  constructor(card: MedicalCard) {
    this.id = card.id;
    this.nickname = card.nickname;
    this.species = card.species;
    this.breed = card.breed;
    this.sex = card.sex;
    this.birth_date = card.birth_date;
    this.created_date = card.created_date;
    if (card.client) {
      this.client = new ClientShortDTO(card.client);
    }
    if (card.appointments) {
      this.appointments = card.appointments.map((appointment) => new AppointmentShortDTO(appointment));
    }
  }
}
