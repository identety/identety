export abstract class AppException extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Specific exceptions
export class AppValidationException extends AppException {
  constructor(message: string) {
    super(message);
  }
}

export class AppNotFoundException extends AppException {
  constructor(entity?: string) {
    super(`${entity || 'Resource'} not found`);
  }
}

export class AppDuplicateException extends AppException {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}
