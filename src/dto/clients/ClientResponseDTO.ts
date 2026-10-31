import { Client } from 'orm/entities/clients/Client';

import { MedicalCardShortDTO } from '../shared/MedicalCardShortDTO';

export class ClientResponseDTO {
  id: number;
  phone: string;
  full_name: string;
  birth_date: string;
  email: string;
  medical_cards?: MedicalCardShortDTO[];

  constructor(client: Client) {
    this.id = client.id;
    this.phone = client.phone;
    this.full_name = `${client.last_name} ${client.first_name} ${client.patronymic}`;
    this.birth_date = client.birth_date;
    this.email = client.email;
    if (client.medical_cards) {
      this.medical_cards = client.medical_cards.map((card) => new MedicalCardShortDTO(card));
    }
  }
}
