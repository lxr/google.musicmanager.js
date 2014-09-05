var fl = {};

fl.partial = function (/* f, args... */) {
  var f = Array.prototype.shift.call(arguments),
      args = arguments;
  return function (/* arguments... */) {
    Array.prototype.unshift.apply(arguments, args);
    return f.apply(this, arguments);
  }
}

fl.async = function (f) {
  return function (/* arguments..., callback */) {
    var callback = Array.prototype.pop.call(arguments);
    try {
      callback(null, f.apply(this, arguments));
    } catch (e) {
      callback(e);
    }
  }
}

fl.async.nextTick = function (func, context, args) {
  setTimeout(Function.prototype.bind.apply(func, [context].concat(args)), 0);
}

fl.async.id = function (/* arguments..., callback */) {
  var callback = Array.prototype.pop.call(arguments);
  Array.prototype.unshift.call(arguments, null);
  callback.apply(this, arguments);
}

fl.async.carry = function (/* f, args... */) {
  var f = Array.prototype.shift.call(arguments),
      args = arguments;
  return function (/* err, res... */) {
    Array.prototype.push.apply(arguments, arguments[0] ? [] : args);
    f.apply(this, arguments);
  }
}

fl.async._compose = function (/* funcs, args..., callback */) {
  var args = Array.prototype.slice.call(arguments),
      funcs = args.shift(),
      callback = args.pop(),
      context = this,
      i = 0;
  function _resume() {
    if (funcs[i]) {
      fl.async.nextTick(funcs[i], context, args.concat(_next));
    } else if (callback) {
      callback.apply(context, [null].concat(args));
    }
  }
  function _next(/* err, res... */) {
    var res = Array.prototype.slice.call(arguments),
        err = res.shift();
    if (err) {
      callback.call(context, err, res.length > 0 ? res[0] : _resume);
    } else {
      ++i;
      args = res;
      _resume();
    }
  }
  _resume();
}

fl.async._applyToAll = function (/* nargout, limit, f, args..., callback */) {
  var args = Array.prototype.slice.call(arguments),
      nargout = args.shift(),
      limit = args.shift(),
      f = args.shift(),
      callback = args.pop(),
      context = this,
      started = 0,
      finished = 0,
      nargin = args[0].length,
      results = [];
  
  function _resume(k) {
    if (k < nargin) {
      fl.async.nextTick(
        f,
        context,
        args.map(function (col) { return col[k] }).concat(_next.bind(null, k))
      );
    } else if(callback && finished === nargin) {
      callback.apply(context, [null].concat(results));
    }
  }
  function _next(/* k, err, res... */) {
    var res = Array.prototype.slice.call(arguments),
        k = res.shift(),
        err = res.shift();
    if (err) {
      callback.call(context, err, res.length > 0 ? res[0] : _resume.bind(0,k));
    } else {
      res.forEach(function (el,j) { results[j][k] = el; });
      finished++;
      _resume(started++);
    }
  }
  
  for (var j = 0; j < nargout; ++j) {
    results.push([]);
  }
  while (started < nargin && (limit <= 0 || started < limit)) {
    _resume(started++);
  }
  if (nargin === 0) {
    _resume(0);
  }
}

fl.async._condition = function (/* f, g, h, args..., callback */) {
  var args = Array.prototype.slice.call(arguments),
      callback = args.pop(),
      funcs = {},
      context = this,
      state = undefined,
      result = undefined;
  funcs[undefined] = args.shift();
  funcs[true] = args.shift();
  funcs[false] = args.shift();
  function _resume() {
    if (!result) {
      fl.async.nextTick(funcs[state], context, args.concat(_next));
    } else if (callback) {
      callback.apply(context, [null].concat(result));
    }
  }
  function _next(/* err, res... */) {
    var res = Array.prototype.slice.call(arguments),
        err = res.shift();
    if (err) {
      callback.call(context, err, res.length > 0 ? res[0] : _resume);
    } else {
      if (state === undefined) {
        state = Boolean(res[0]);
      } else {
        result = res;
      }
      _resume();
    }
  }
  _resume();
}

fl.async._whilst = function (/* condition, loop, args..., callback */) {
  var args = Array.prototype.slice.call(arguments),
      condition = args.shift(),
      loop = args.shift(),
      callback = args.pop(),
      context = this,
      state = undefined;
  function _resume() {
    if (state === true) {
      fl.async.nextTick(loop, context, args.concat(_next));
    } else if (state === undefined) {
      fl.async.nextTick(condition, context, args.concat(_next));
    } else if (state === false && callback) {
      callback.apply(context, [null].concat(args));
    }
  }
  function _next(/* err, res... */) {
    var res = Array.prototype.slice.call(arguments),
        err = res.shift();
    if (err) {
      callback.call(context, err, res.length > 0 ? res[0] : _resume);
    } else {
      if (state === undefined) {
        state = Boolean(res[0]);
      } else {
        args = res;
        state = undefined;
      }
      _resume();
    }
  }
  _resume();
}

fl.async.compose = function (/* funcs */) {
  return fl.partial(fl.async._compose, arguments);
}

fl.async.applyToAll = function (nargout, limit, f) {
  return fl.partial(fl.async._applyToAll, nargout, limit, f);
}

fl.async.condition = function (f, g, h) {
  return fl.partial(fl.async._condition, f, g, h);
}

fl.async.whilst = function (condition, loop) {
  return fl.partial(fl.async._whilst, condition, loop);
}

fl.async.doWhilst = function (condition, loop) {
  return fl.async.compose(loop, fl.async.whilst(condition, loop));
}
