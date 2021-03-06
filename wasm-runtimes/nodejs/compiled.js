/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.datatypes = (function() {

    /**
     * Namespace datatypes.
     * @exports datatypes
     * @namespace
     */
    var datatypes = {};

    datatypes.Arguments = (function() {

        /**
         * Properties of an Arguments.
         * @memberof datatypes
         * @interface IArguments
         * @property {string|null} [fnname] Arguments fnname
         * @property {string|null} [txid] Arguments txid
         * @property {string|null} [channelid] Arguments channelid
         * @property {Array.<string>|null} [args] Arguments args
         */

        /**
         * Constructs a new Arguments.
         * @memberof datatypes
         * @classdesc Represents an Arguments.
         * @implements IArguments
         * @constructor
         * @param {datatypes.IArguments=} [properties] Properties to set
         */
        function Arguments(properties) {
            this.args = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Arguments fnname.
         * @member {string} fnname
         * @memberof datatypes.Arguments
         * @instance
         */
        Arguments.prototype.fnname = "";

        /**
         * Arguments txid.
         * @member {string} txid
         * @memberof datatypes.Arguments
         * @instance
         */
        Arguments.prototype.txid = "";

        /**
         * Arguments channelid.
         * @member {string} channelid
         * @memberof datatypes.Arguments
         * @instance
         */
        Arguments.prototype.channelid = "";

        /**
         * Arguments args.
         * @member {Array.<string>} args
         * @memberof datatypes.Arguments
         * @instance
         */
        Arguments.prototype.args = $util.emptyArray;

        /**
         * Creates a new Arguments instance using the specified properties.
         * @function create
         * @memberof datatypes.Arguments
         * @static
         * @param {datatypes.IArguments=} [properties] Properties to set
         * @returns {datatypes.Arguments} Arguments instance
         */
        Arguments.create = function create(properties) {
            return new Arguments(properties);
        };

        /**
         * Encodes the specified Arguments message. Does not implicitly {@link datatypes.Arguments.verify|verify} messages.
         * @function encode
         * @memberof datatypes.Arguments
         * @static
         * @param {datatypes.IArguments} message Arguments message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Arguments.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fnname != null && message.hasOwnProperty("fnname"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.fnname);
            if (message.txid != null && message.hasOwnProperty("txid"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.txid);
            if (message.channelid != null && message.hasOwnProperty("channelid"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.channelid);
            if (message.args != null && message.args.length)
                for (var i = 0; i < message.args.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.args[i]);
            return writer;
        };

        /**
         * Encodes the specified Arguments message, length delimited. Does not implicitly {@link datatypes.Arguments.verify|verify} messages.
         * @function encodeDelimited
         * @memberof datatypes.Arguments
         * @static
         * @param {datatypes.IArguments} message Arguments message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Arguments.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Arguments message from the specified reader or buffer.
         * @function decode
         * @memberof datatypes.Arguments
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {datatypes.Arguments} Arguments
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Arguments.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.datatypes.Arguments();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.fnname = reader.string();
                    break;
                case 2:
                    message.txid = reader.string();
                    break;
                case 3:
                    message.channelid = reader.string();
                    break;
                case 4:
                    if (!(message.args && message.args.length))
                        message.args = [];
                    message.args.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Arguments message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof datatypes.Arguments
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {datatypes.Arguments} Arguments
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Arguments.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Arguments message.
         * @function verify
         * @memberof datatypes.Arguments
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Arguments.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fnname != null && message.hasOwnProperty("fnname"))
                if (!$util.isString(message.fnname))
                    return "fnname: string expected";
            if (message.txid != null && message.hasOwnProperty("txid"))
                if (!$util.isString(message.txid))
                    return "txid: string expected";
            if (message.channelid != null && message.hasOwnProperty("channelid"))
                if (!$util.isString(message.channelid))
                    return "channelid: string expected";
            if (message.args != null && message.hasOwnProperty("args")) {
                if (!Array.isArray(message.args))
                    return "args: array expected";
                for (var i = 0; i < message.args.length; ++i)
                    if (!$util.isString(message.args[i]))
                        return "args: string[] expected";
            }
            return null;
        };

        /**
         * Creates an Arguments message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof datatypes.Arguments
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {datatypes.Arguments} Arguments
         */
        Arguments.fromObject = function fromObject(object) {
            if (object instanceof $root.datatypes.Arguments)
                return object;
            var message = new $root.datatypes.Arguments();
            if (object.fnname != null)
                message.fnname = String(object.fnname);
            if (object.txid != null)
                message.txid = String(object.txid);
            if (object.channelid != null)
                message.channelid = String(object.channelid);
            if (object.args) {
                if (!Array.isArray(object.args))
                    throw TypeError(".datatypes.Arguments.args: array expected");
                message.args = [];
                for (var i = 0; i < object.args.length; ++i)
                    message.args[i] = String(object.args[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from an Arguments message. Also converts values to other types if specified.
         * @function toObject
         * @memberof datatypes.Arguments
         * @static
         * @param {datatypes.Arguments} message Arguments
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Arguments.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.args = [];
            if (options.defaults) {
                object.fnname = "";
                object.txid = "";
                object.channelid = "";
            }
            if (message.fnname != null && message.hasOwnProperty("fnname"))
                object.fnname = message.fnname;
            if (message.txid != null && message.hasOwnProperty("txid"))
                object.txid = message.txid;
            if (message.channelid != null && message.hasOwnProperty("channelid"))
                object.channelid = message.channelid;
            if (message.args && message.args.length) {
                object.args = [];
                for (var j = 0; j < message.args.length; ++j)
                    object.args[j] = message.args[j];
            }
            return object;
        };

        /**
         * Converts this Arguments to JSON.
         * @function toJSON
         * @memberof datatypes.Arguments
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Arguments.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Arguments;
    })();

    datatypes.Return = (function() {

        /**
         * Properties of a Return.
         * @memberof datatypes
         * @interface IReturn
         * @property {number|null} [code] Return code
         * @property {string|null} [data] Return data
         */

        /**
         * Constructs a new Return.
         * @memberof datatypes
         * @classdesc Represents a Return.
         * @implements IReturn
         * @constructor
         * @param {datatypes.IReturn=} [properties] Properties to set
         */
        function Return(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Return code.
         * @member {number} code
         * @memberof datatypes.Return
         * @instance
         */
        Return.prototype.code = 0;

        /**
         * Return data.
         * @member {string} data
         * @memberof datatypes.Return
         * @instance
         */
        Return.prototype.data = "";

        /**
         * Creates a new Return instance using the specified properties.
         * @function create
         * @memberof datatypes.Return
         * @static
         * @param {datatypes.IReturn=} [properties] Properties to set
         * @returns {datatypes.Return} Return instance
         */
        Return.create = function create(properties) {
            return new Return(properties);
        };

        /**
         * Encodes the specified Return message. Does not implicitly {@link datatypes.Return.verify|verify} messages.
         * @function encode
         * @memberof datatypes.Return
         * @static
         * @param {datatypes.IReturn} message Return message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Return.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.data != null && message.hasOwnProperty("data"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.data);
            return writer;
        };

        /**
         * Encodes the specified Return message, length delimited. Does not implicitly {@link datatypes.Return.verify|verify} messages.
         * @function encodeDelimited
         * @memberof datatypes.Return
         * @static
         * @param {datatypes.IReturn} message Return message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Return.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Return message from the specified reader or buffer.
         * @function decode
         * @memberof datatypes.Return
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {datatypes.Return} Return
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Return.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.datatypes.Return();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.code = reader.int32();
                    break;
                case 2:
                    message.data = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Return message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof datatypes.Return
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {datatypes.Return} Return
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Return.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Return message.
         * @function verify
         * @memberof datatypes.Return
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Return.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!$util.isString(message.data))
                    return "data: string expected";
            return null;
        };

        /**
         * Creates a Return message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof datatypes.Return
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {datatypes.Return} Return
         */
        Return.fromObject = function fromObject(object) {
            if (object instanceof $root.datatypes.Return)
                return object;
            var message = new $root.datatypes.Return();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.data != null)
                message.data = String(object.data);
            return message;
        };

        /**
         * Creates a plain object from a Return message. Also converts values to other types if specified.
         * @function toObject
         * @memberof datatypes.Return
         * @static
         * @param {datatypes.Return} message Return
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Return.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.code = 0;
                object.data = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = message.data;
            return object;
        };

        /**
         * Converts this Return to JSON.
         * @function toJSON
         * @memberof datatypes.Return
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Return.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Return;
    })();

    return datatypes;
})();

module.exports = $root;
