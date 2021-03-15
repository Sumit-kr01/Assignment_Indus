/* eslint-disable max-classes-per-file */
class existingUser extends Error {
  constructor(message) {
    super(message);
    this.mesaage = message;
    this.statusCode = 409;
  }
}

class notFound extends Error {
  constructor(message) {
    console.log(3);
    super(message);
    this.mesaage = message;
    this.statusCode = 404;
  }
}

class authFailed extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.statusCode = 401;
  }
}

class badRequest extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.statusCode = 400;
  }
}

class internalServer extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.statusCode = 500;
  }
}

module.exports = {
  existingUser, notFound, authFailed, badRequest, internalServer,
};
