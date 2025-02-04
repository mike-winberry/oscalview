import { TextEncoder, TextDecoder } from 'util';

// @ts-ignore -- Node's TextEncoder/Decoder are compatible with what we need
global.TextEncoder = TextEncoder;
// @ts-ignore -- Node's TextEncoder/Decoder are compatible with what we need
global.TextDecoder = TextDecoder;

global.Uint8Array = Uint8Array;
global.Uint32Array = Uint32Array;
global.Uint16Array = Uint16Array;
global.Uint8ClampedArray = Uint8ClampedArray;
global.Int8Array = Int8Array;
