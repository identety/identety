import { AppExceptionMapper } from '@/shared/interface/http/app-exception-mapper';

export abstract class BaseController {
  protected async execute<T>(action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      throw AppExceptionMapper.toHttp(error);
    }
  }
}
