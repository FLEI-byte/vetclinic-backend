import { getRepository } from 'typeorm';

import { MedicalCardDto } from 'dto/medical-cards/MedicalCardDto';
import { Client } from 'orm/entities/clients/Client';
import { MedicalCard } from 'orm/entities/medical-cards/MedicalCard';

export class MedicalCardService {
  private medicalCardRepository = getRepository(MedicalCard);
  private clientRepository = getRepository(Client);

  async findAll(): Promise<MedicalCard[]> {
    return this.medicalCardRepository.find({ relations: ['client', 'appointments'], order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<MedicalCard | undefined> {
    return this.medicalCardRepository.findOne(id, { relations: ['client', 'appointments'] });
  }

  async create(data: MedicalCardDto): Promise<MedicalCard | null | undefined> {
    const { client_id, ...rest } = data;
    const client = await this.clientRepository.findOne(client_id);
    if (!client) return null;
    const card = this.medicalCardRepository.create({ ...rest, client });
    const saved = await this.medicalCardRepository.save(card);
    return this.findOne(saved.id);
  }

  async update(id: number, data: Partial<MedicalCardDto>): Promise<MedicalCard | null | undefined> {
    const card = await this.medicalCardRepository.findOne(id);
    if (!card) return undefined;
    const { client_id, ...rest } = data;
    if (client_id !== undefined) {
      const client = await this.clientRepository.findOne(client_id);
      if (!client) return null;
      card.client = client;
    }
    Object.assign(card, rest);
    await this.medicalCardRepository.save(card);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const card = await this.medicalCardRepository.findOne(id);
    if (!card) return false;
    await this.medicalCardRepository.remove(card);
    return true;
  }
}
