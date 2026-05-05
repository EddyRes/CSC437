import { Song } from "../models/index.js";
declare function get(id: string): Song;
declare function getAll(): Song[];
declare const _default: {
    get: typeof get;
    getAll: typeof getAll;
};
export default _default;
