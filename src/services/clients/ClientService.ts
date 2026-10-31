import { getRepository } from 'typeorm';

import { ClientDto } from 'dto/clients/ClientDto';
import { Client } from 'orm/entities/clients/Client';

export class ClientService {
  private clientRepository = getRepository(Client);

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({ relations: ['medical_cards'], order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Client | undefined> {
    return this.clientRepository.findOne(id, { relations: ['medical_cards'] });
  }

  async create(data: ClientDto): Promise<Client> {
    const client = this.clientRepository.create(data);
    return this.clientRepository.save(client);
  }

  async update(id: number, data: Partial<ClientDto>): Promise<Client | undefined> {
    const client = await this.clientRepository.findOne(id);
    if (!client) return undefined;
    Object.assign(client, data);
    return this.clientRepository.save(client);
  }

  async delete(id: number): Promise<boolean> {
    const client = await this.clientRepository.findOne(id);
    if (!client) return false;
    await this.clientRepository.remove(client);
    return true;
  }
}
