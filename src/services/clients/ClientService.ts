import { getRepository } from 'typeorm';

import { ClientDto } from 'dto/clients/ClientDto';
import { Client } from 'orm/entities/clients/Client';

export class ClientService {
  private static repo() {
    return getRepository(Client);
  }

  static findAll() {
    return this.repo().find({ relations: ['medical_cards'], order: { id: 'ASC' } });
  }

  static findById(id: number) {
    return this.repo().findOne(id, { relations: ['medical_cards'] });
  }

  static async create(data: ClientDto) {
    const client = this.repo().create(data);
    return this.repo().save(client);
  }

  static async update(id: number, data: Partial<ClientDto>) {
    const client = await this.repo().findOne(id);
    if (!client) return undefined;
    Object.assign(client, data);
    return this.repo().save(client);
  }

  static async remove(id: number) {
    const client = await this.repo().findOne(id);
    if (!client) return false;
    await this.repo().remove(client);
    return true;
  }
}
