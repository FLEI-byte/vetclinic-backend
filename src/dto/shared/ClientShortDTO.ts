import { Client } from 'orm/entities/clients/Client';

export class ClientShortDTO {
  id: number;
  phone: string;
  full_name: string;
  email: string;

  constructor(client: Client) {
    this.id = client.id;
    this.phone = client.phone;
    this.full_name = `${client.last_name} ${client.first_name} ${client.patronymic}`;
    this.email = client.email;
  }
}
