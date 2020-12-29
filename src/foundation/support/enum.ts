import Joi from "@hapi/joi";

class EnumType {
  private dict: Obj<string | number>;

  constructor(dict: Obj<string | number>) {
    this.dict = dict;
    Object.assign(this, dict);
  }

  values() {
    return Object.values(this.dict);
  }

  keys() {
    return Object.keys(this.dict);
  }

  joi() {
    return Joi.string().allow(...this.values());
  }
}

export default function Enum<T extends Obj<string>>(values: T): EnumType & T {
  // @ts-ignore
  return new EnumType(values);
}
