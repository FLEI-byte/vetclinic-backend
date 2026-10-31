import { MedicalCard } from 'orm/entities/medical-cards/MedicalCard';

import { ClientShortDTO } from './ClientShortDTO';

export class MedicalCardShortDTO {
  id: number;
  nickname: string;
  species: string;
  breed: string;
  sex: string;
  birth_date: string;
  created_date: string;
  client?: ClientShortDTO;

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
  }
}
