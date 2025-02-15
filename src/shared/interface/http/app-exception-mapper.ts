import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException as HttpNotFoundException,
  UnauthorizedException as HttpUnauthorizedException,
} from '@nestjs/common';
import {
  AppValidationException,
  AppNotFoundException,
  UnauthorizedException,
  AppException,
  AppDuplicateException,
  AppInvalidInputException,
  AppNotAllowedException,
} from '@/shared/application/exceptions/appException';

export class AppExceptionMapper {
  static toHttp(error: Error) {
    if (error instanceof AppValidationException) {
      return new BadRequestException(error.message);
    }

    if (error instanceof AppDuplicateException) {
      return new ConflictException(error.message);
    }

    if (error instanceof AppInvalidInputException) {
      return new BadRequestException(error.message);
    }

    if (error instanceof AppNotAllowedException) {
      return new ForbiddenException(error.message);
    }

    if (error instanceof AppNotFoundException) {
      return new HttpNotFoundException(error.message);
    }

    if (error instanceof UnauthorizedException) {
      return new HttpUnauthorizedException(error.message);
    }

    if (error instanceof AppException) {
      return new BadRequestException(error.message);
    }

    return error;
  }
}
