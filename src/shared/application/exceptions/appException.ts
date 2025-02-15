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
  constructor(message?: string) {
    super(message);
  }
}

export class AppDuplicateException extends AppException {
  constructor(message: string) {
    super(message);
  }
}

export class AppInvalidInputException extends AppException {
  constructor(message: string) {
    super(message);
  }
}

export class AppNotAllowedException extends AppException {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}
