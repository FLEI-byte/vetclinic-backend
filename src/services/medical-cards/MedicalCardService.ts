import { getRepository } from 'typeorm';

import { MedicalCardDto } from 'dto/medical-cards/MedicalCardDto';
import { Client } from 'orm/entities/clients/Client';
import { MedicalCard } from 'orm/entities/medical-cards/MedicalCard';

export class MedicalCardService {
  private static repo() {
    return getRepository(MedicalCard);
  }

  static findAll() {
    return this.repo().find({ relations: ['client', 'appointments'], order: { id: 'ASC' } });
  }

  static findById(id: number) {
    return this.repo().findOne(id, { relations: ['client', 'appointments'] });
  }

  static async create(data: MedicalCardDto) {
    const { client_id, ...rest } = data;
    const client = await getRepository(Client).findOne(client_id);
    if (!client) return null;
    const card = this.repo().create({ ...rest, client });
    const saved = await this.repo().save(card);
    return this.findById(saved.id);
  }

  static async update(id: number, data: Partial<MedicalCardDto>) {
    const card = await this.repo().findOne(id);
    if (!card) return undefined;
    const { client_id, ...rest } = data;
    if (client_id !== undefined) {
      const client = await getRepository(Client).findOne(client_id);
      if (!client) return null;
      card.client = client;
    }
    Object.assign(card, rest);
    await this.repo().save(card);
    return this.findById(id);
  }

  static async remove(id: number) {
    const card = await this.repo().findOne(id);
    if (!card) return false;
    await this.repo().remove(card);
    return true;
  }
}
