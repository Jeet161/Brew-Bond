export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class CapacityConflictError extends DomainError {
  constructor(message: string = "This event is currently full.") {
    super(message, "CAPACITY_CONFLICT", 409);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Authentication required.") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = "You do not have permission to perform this action.") {
    super(message, "FORBIDDEN", 403);
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found.`, "NOT_FOUND", 404);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 422);
  }
}

