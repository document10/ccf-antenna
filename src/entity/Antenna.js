"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Antenna = void 0;
var typeorm_1 = require("typeorm");
var Antenna = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    var _range_decorators;
    var _range_initializers = [];
    var _range_extraInitializers = [];
    var _operators_decorators;
    var _operators_initializers = [];
    var _operators_extraInitializers = [];
    var _generation_decorators;
    var _generation_initializers = [];
    var _generation_extraInitializers = [];
    var _active_decorators;
    var _active_initializers = [];
    var _active_extraInitializers = [];
    var Antenna = _classThis = /** @class */ (function () {
        function Antenna_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.latitude = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.range = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _range_initializers, void 0));
            this.operators = (__runInitializers(this, _range_extraInitializers), __runInitializers(this, _operators_initializers, void 0));
            this.generation = (__runInitializers(this, _operators_extraInitializers), __runInitializers(this, _generation_initializers, void 0));
            this.active = (__runInitializers(this, _generation_extraInitializers), __runInitializers(this, _active_initializers, void 0));
            __runInitializers(this, _active_extraInitializers);
        }
        return Antenna_1;
    }());
    __setFunctionName(_classThis, "Antenna");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _latitude_decorators = [(0, typeorm_1.Column)()];
        _longitude_decorators = [(0, typeorm_1.Column)()];
        _range_decorators = [(0, typeorm_1.Column)()];
        _operators_decorators = [(0, typeorm_1.Column)()];
        _generation_decorators = [(0, typeorm_1.Column)()];
        _active_decorators = [(0, typeorm_1.Column)({ default: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _range_decorators, { kind: "field", name: "range", static: false, private: false, access: { has: function (obj) { return "range" in obj; }, get: function (obj) { return obj.range; }, set: function (obj, value) { obj.range = value; } }, metadata: _metadata }, _range_initializers, _range_extraInitializers);
        __esDecorate(null, null, _operators_decorators, { kind: "field", name: "operators", static: false, private: false, access: { has: function (obj) { return "operators" in obj; }, get: function (obj) { return obj.operators; }, set: function (obj, value) { obj.operators = value; } }, metadata: _metadata }, _operators_initializers, _operators_extraInitializers);
        __esDecorate(null, null, _generation_decorators, { kind: "field", name: "generation", static: false, private: false, access: { has: function (obj) { return "generation" in obj; }, get: function (obj) { return obj.generation; }, set: function (obj, value) { obj.generation = value; } }, metadata: _metadata }, _generation_initializers, _generation_extraInitializers);
        __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: function (obj) { return "active" in obj; }, get: function (obj) { return obj.active; }, set: function (obj, value) { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Antenna = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Antenna = _classThis;
}();
exports.Antenna = Antenna;
