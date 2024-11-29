export class RoleRepository {
  constructor() {}

  findById(id: string): Promise<string> {
    return Promise.resolve('auth:' + id);
  }
}
