//require Operation.js

function Client(id, token) {
  this.id = id;
  this.token = token;
}

Client._wrapper = function (task) {
  return function (/* arguments... */) {
    Array.prototype.unshift.call(arguments, task, this.token, this.id);
    var operation = Object.create(Operation.prototype);
    Operation.apply(operation, arguments);
    return operation;
  }
}

Client.prototype.register = Client._wrapper(Operation.Register);
Client.prototype.upload = Client._wrapper(Operation.Upload);
