export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export type JSONArray = JSONValue[] | JSONObject[];
export interface JSONObject {
    [key: string]: JSONValue;
}
