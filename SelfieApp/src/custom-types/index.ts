/**
 * From `T`, pick a set of properties whose keys are not in the union `K`
 */
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

/**
 * From `T`, pick a set of properties whose keys are not in the union `K`
 * This is the same as Omit but `K` keys have to be keys of `T`
 */
export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Make a callable with `T` rest params and `U` return
 */
// tslint:disable-next-line:invalid-void
export type Callable<T extends any[] = [], U extends any = void> = {
  // tslint:disable-next-line: callable-types
  (...args: T): U;
};

/**
 * Map a mapped object of `T` values
 */
export type Mapped<T> = { [K: string]: T };

/**
 * Is a map of functions
 */
export type MappedFunction = Mapped<(...args: any[]) => any>;

/**
 * Make all K properties of `T` required
 */
export type RequireKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Without<T, K>;

/**
 * Make all K properties of `T` required
 */
export type PartialKeys<T, K extends keyof T> = Partial<Pick<T, K>> &
  Without<T, K>;

/**
 * Make all properties in `T` not readonly
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * If specified type `T` is never or undefined return true else false
 */
export type IsNeverOrUndefined<T> = [T] extends [never | undefined]
  ? true
  : false;

/**
 * Make all properties in `T` with type never optionals and other required
 */
export type OmitNever<T> = Required<
  Pick<
    T,
    { [Key in keyof T]: IsNever<T[Key]> extends true ? never : Key }[keyof T]
  >
> &
  Partial<
    Pick<
      T,
      { [Key in keyof T]: IsNever<T[Key]> extends true ? Key : never }[keyof T]
    >
  >;

/**
 * Return the value of the Promise `T`
 */
export type PromiseReturnType<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any[]) => Promise<infer UFunc>
  ? UFunc
  : T extends (...args: any[]) => (...args: any[]) => Promise<infer UFunc>
  ? UFunc
  : never;

/**
 * Return all missing keys of `T`
 */
export type MissingKeysOf<T, K> = Exclude<K, keyof T>;

/**
 * Return all extra keys of `T`
 */
export type ExtraKeysOf<T, K> = {
  [Key in keyof T]: Extract<K, Key> extends never ? Key : never;
}[keyof T];

/**
 * Return true if object `T` is missing keys of `K`
 */
export type isMissingKeys<T, K> = IsNever<MissingKeysOf<T, K>>;

/**
 * Return true if object `T` has keys that are not in the keys of `K`
 */
export type hasExtraKeys<T, K> = IsNever<ExtraKeysOf<T, K>>;

/**
 * Return true if `MappedEnum` implements all keys of `Enum` else return the problematics keys
 */
export type isValidMappedEnum<MappedEnum, Enum> = [
  MissingKeysOf<MappedEnum, Enum>
] extends [never]
  ? [ExtraKeysOf<MappedEnum, Enum>] extends [never]
    ? true
    : { extra_keys: ExtraKeysOf<MappedEnum, Enum> }
  : { missing_keys: MissingKeysOf<MappedEnum, Enum> };

/**
 * Return true if the mapped object `T` is empty else return the keys of `T`
 */
export type isEmpty<T extends Record<string, any>> = keyof T extends Record<
  string,
  never
>
  ? true
  : { keys: keyof T };

/**
 * Return true if `MappedEnum` implements all `MappedKeys`
 */
export type isValidMapped<MappedEnum, MappedKeys> = isValidMappedEnum<
  MappedEnum,
  keyof MappedKeys
>;

/**
 * Return the second parameter of a function `T` or never if don't exist
 */
export type SecondFunctionParameter<
  T extends (...args: any[]) => any
> = T extends (a: any) => any
  ? never
  : T extends (a: any, b: infer B) => any
  ? B
  : never;

/**
 * Return the parameters of a function `T` without the first
 */
export type ParametersWithoutFirst<
  T extends (...args: any[]) => any
> = T extends (a: any) => any
  ? never[]
  : T extends (a: any, ...args: infer Args) => any
  ? Args
  : never;

/**
 * Add to the parameters of function `Fn` the argument `T` to the first position
 */
export type AddFirstParameter<
  Fn extends (...args: any[]) => any,
  T,
  R = ReturnType<Fn>
> = (a: T, ...args: Parameters<Fn>) => R;

/**
 * Apply readonly fields to nested objects of `T`
 */
export type DeepReadonly<T> = T extends { [K: string]: any }
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

/**
 * Remove readonly fields to nested objects of `T`
 */
export type DeepWriteable<T> = T extends { [K: string]: any }
  ? { -readonly [K in keyof T]: DeepWriteable<T[K]> }
  : T;

/**
 * Remove null fields to nested objects of `T`
 *
 * SEE: https://github.com/piotrwitek/utility-types/blob/master/src/mapped-types.ts#L487
 */
export type DeepNonNullable<T> = T extends (...args: any[]) => any
  ? T
  : T extends any[]
  ? _DeepNonNullableArray<T[number]>
  : T extends object
  ? _DeepNonNullableObject<T>
  : T;

// tslint:disable-next-line: interface-name class-name
export interface _DeepNonNullableArray<T>
  extends Array<DeepNonNullable<NonNullable<T>>> {}
export type _DeepNonNullableObject<T> = {
  [P in keyof T]-?: DeepNonNullable<NonNullable<T[P]>>;
};

/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 * @param expected - True if the passed in type argument resolved to true.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#L5
 */
/* tslint:disable:no-empty */
export function assertType<T, _Why extends string = ''>(_expected: T): void {}
export function assertNever<T, _Why extends string = ''>(
  ..._args: IsNever<T> extends true ? [] : [IsNever<T>]
): void {}
export function assertSerializable<
  T extends Serializable,
  _Why extends string = ''
>(_expected?: T): void {}
export function assertSerializableWithUndefined<
  T extends SerializableWithUndefined,
  _Why extends string = ''
>(_expected?: T): void {}
export function assertEmpty<
  T extends Record<string, any>,
  _Why extends string = ''
>(..._args: isEmpty<T> extends true ? [] : [isEmpty<T>]): void {}
/* tslint:enable */

/**
 * Asserts at compile time that the provided type argument's type resolves to true.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#L11
 */
export type AssertTrue<T extends true> = T extends true ? never : never;

/**
 * Asserts at compile time that the provided type argument's type resolves to false.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#L16
 */
export type AssertFalse<T extends false> = T extends false ? never : never;

/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#21
 */
export type Assert<
  T extends true | false,
  Expected extends T
> = Expected extends T ? never : never;

/**
 * Checks if the type `T` has the specified type `U`.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#L26
 */
export type Has<T, U> = IsAny<T> extends true
  ? true
  : IsAny<U> extends true
  ? false
  : Extract<T, U> extends never
  ? false
  : true;

/**
 * Checks if the type `T` does not have the specified type `U`.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#L33
 */
export type NotHas<T, U> = Has<T, U> extends true ? false : true;

/**
 * Checks if the type `T` is possibly null or undefined.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#L38
 */
export type IsNullable<T> = Extract<T, null | undefined> extends never // tslint:disable-line: no-null-undefined-union
  ? false
  : true;

/**
 * Checks if the type `T` exactly matches type `U`.
 * @remarks This is useful for checking if two union types match exactly.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#L44
 */
export type IsExact<T, U> = IsAny<T> extends true
  ? IsAny<U> extends true
    ? true
    : false
  : IsAny<U> extends true
  ? false
  : [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;

/**
 * Checks if the type `T` is the `any` type.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#L51
 */
export type IsAny<T> = IsUnknown<T> extends true
  ? false
  : IsNever<T> extends true
  ? false
  : T extends any
  ? any extends T
    ? true
    : false
  : false;

/**
 * Checks it the type `T` is the `never` type.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#58
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Checks it the type `T` is the `unknown` type.
 *
 * SEE: https://github.com/dsherret/conditional-type-checks/blob/master/index.ts#63
 */
export type IsUnknown<T> = IsNever<T> extends true
  ? false
  : T extends unknown
  ? unknown extends T
    ? /* catch any type */ T extends string
      ? false
      : true
    : false
  : false;

/**
 * Checks if type `T` implements all keys `K`
 */
export type AssertImplementsKeys<T, K> = IsExact<Extract<keyof T, K>, K>;

/**
 * Rename the key `K` from `T` to `N`
 */
export type Rename<T, K extends keyof T, N extends string> = Without<T, K> &
  { [P in N]: T[K] };

export type RenameIfExist<T, K, N extends string> = K extends keyof T
  ? Rename<T, K, N>
  : T;

/**
 * A simple function that take as argument `T`
 *
 * Usefull to strongly type a variable.
 *
 * @example
 * type a = { foo: number; bar: string };
 * const strong = MakeType<a>({ foo: 'foo', bar: 42 });
 */
export function StrongType<T>(t: T): T {
  return t;
}

/**
 * Transform an object `D` to an union of objects with all unique keys of `D`
 *
 * @example
 * type union = MakeUnion<{ a: string; b: number }>
 * // union = { a: string; } | { b: number; }
 */
export type MakeUnion<D extends { [k: string]: any }> = {
  [Keys in keyof D]: { [K in Keys]: D[K] };
}[keyof D];

/**
 * Json / Serializable values
 */
export type Serializable = JSONObject;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONPrimitive = string | number | boolean | null;
export type JSONObject = { [member: string]: JSONValue };
export interface JSONArray extends Readonly<JSONValue[]> {} // tslint:disable-line: interface-name

export type SerializableWithUndefined = JSONObjectWithUndefined;
export type JSONValueWithUndefined =
  // tslint:disable-next-line: no-null-undefined-union
  | JSONPrimitiveWithUndefined
  | JSONObjectWithUndefined
  | JSONArrayWithUndefined
  | undefined;
export type JSONPrimitiveWithUndefined = string | number | boolean | null;
export type JSONObjectWithUndefined = {
  [member: string]: JSONValueWithUndefined;
};
export interface JSONArrayWithUndefined  // tslint:disable-line: interface-name
  extends Readonly<JSONValueWithUndefined[]> {}

/**
 * Checks if type `T` is a valid serializable JSON object
 *
 * Usefull for a redux state (with redux-persist).
 *
 * @example
 * assertType<IsJSON<{ foo: string }>>(true);
 * assertType<IsJSON<{ foo: Date }>>(false);
 */
export type IsJSON<T extends { [K: string]: any }> = T extends JSONObject
  ? true
  : false;
export type IsSerializable<T> = T extends Serializable ? true : false;

/**
 * Brand
 *
 * @example
 * // create a branded type
 * type PostId = Brand<number, 'PostId'>;
 * type PostIdBase = BrandingOfBrand<PostId>; // 'PostId'
 * type PostIdBase = BaseOfBrand<PostId>; // number
 * // create the branded type creator
 * const PostIdBrander = makeBrander<PostId>(); // Brander<PostId>
 * // create a branded value
 * const id = PostIdBrander(12); // `id` is a PostId with 12 as value
 *
 * SEE: https://github.com/kourge/ts-brand
 */
export type Brand<Base, Branding> = Base & {
  __brand__: [Base, Branding];
};
export type AnyBrand = Brand<any, any>;
export type IsBrand<B extends AnyBrand> = B['__brand__'] extends [any, any]
  ? true
  : false;
export type BaseOfBrand<B extends AnyBrand> = B['__brand__'][0];
export type BrandingOfBrand<B extends AnyBrand> = B['__brand__'][1];
export type Brander<B extends AnyBrand> = (underlying: BaseOfBrand<B>) => B;
export function makeBrander<B extends AnyBrand>(): Brander<B> {
  return (underlying: BaseOfBrand<B>): B => underlying as B;
}

type __BrandAAA = Brand<number, 'AAA'>;
type __BrandBBB = Brand<string, 'BBB'>;

assertType<IsExact<__BrandAAA, number & { __brand__: [number, 'AAA'] }>>(true);
assertType<IsExact<__BrandBBB, string & { __brand__: [string, 'BBB'] }>>(true);

assertType<IsBrand<__BrandAAA>>(true);
assertType<IsBrand<__BrandBBB>>(true);
assertType<IsBrand<number>>(false);
assertType<IsBrand<string>>(false);
assertType<IsBrand<{ foo: string }>>(false);

assertType<IsExact<BrandingOfBrand<__BrandAAA>, 'AAA'>>(true);
assertType<IsExact<BrandingOfBrand<__BrandBBB>, 'BBB'>>(true);
assertType<IsExact<BrandingOfBrand<string>, unknown>>(true);

assertType<IsExact<BaseOfBrand<__BrandAAA>, number>>(true);
assertType<IsExact<BaseOfBrand<__BrandBBB>, string>>(true);
assertType<IsExact<BaseOfBrand<string>, unknown>>(true);

assertType<IsExact<Brander<__BrandAAA>, (underlying: number) => __BrandAAA>>(
  true
);
assertType<IsExact<Brander<__BrandBBB>, (underlying: string) => __BrandBBB>>(
  true
);

/**
 * Mapped Brand
 *
 * @example
 * // create a branded type
 * type PostId = Brand<number, 'PostId'>;
 * const PostId = makeBrander<PostId>();
 * // create a map of this type
 * type DateByPostId = MappedBrand<PostId, Date>;
 * // create the mapped brand type creator
 * const DateByPostId = makeMappedBrander<DateByPostId>();
 * // enclose the mapped brand in an helper object for type safety
 * const map = makeMappedBrandHelper({
 *   // create the map with initial values (optionnal)
 *   brand: DateByPostId([
 *     [PostId(0), new Date()],
 *     [PostId(1), new Date()],
 *     [PostId(2), new Date()]
 *   ]),
 *   // specity that the brand is mapped with numbers
 *   isNumbered: true
 * });
 * // you can use methods of the helper
 * // check keys
 * if (map.has(PostId(2))) {
 *   // get keys
 *   const id = map.get(PostId(2))!;
 *   // set Keys
 *   map.set(PostId(3), new Date());
 * }
 * // keys, values or entries
 * const [keys, values] = [map.keys(), map.values()];
 * for (const [postId, date] of map.entries()) {}
 * // get original brand object
 * const brand = map.getBrand();
 * // copy brand
 * const anotherBrand1 = map.cloneWithHelper();
 * const anotherBrand2 = makeMappedBrandHelper({
 *   brand: { ...brand },
 *   isNumbered: true
 * });
 *
 * SEE: https://github.com/kourge/ts-brand
 */
export type MappedBrand<
  Key extends AnyBrand | keyof any,
  Value extends any
> = IsBrand<Key> extends true
  ? { [K in BaseOfBrand<Key>]: Value } & { __mapped__: [Key, Value] }
  : Key extends keyof any
  ? { [K in Key]: Value } & { __mapped__: [Key, Value] }
  : never;
export type AnyMappedBrand = MappedBrand<any, any>;
export type KeysOfMappedBrand<B extends AnyMappedBrand> = B['__mapped__'][0];
export type ValuesOfMappedBrand<B extends AnyMappedBrand> = B['__mapped__'][1];
export type MappedBrander<
  B extends AnyMappedBrand,
  Keys = KeysOfMappedBrand<B>,
  Values = ValuesOfMappedBrand<B>
> = (properties?: Array<[Keys, Values]>) => B;
export function makeMappedBrander<B extends AnyMappedBrand>(): MappedBrander<
  B
> {
  return (properties): B =>
    (properties || []).reduce<B>((acc, [key, value]) => {
      // HACK: typescript makeMappedBrander -@thery at 6/17/2019, 4:36:10 PM
      // @ts-ignore
      acc[key] = value;
      return acc;
    }, ({} as any) as B);
}
export type MappedBrandHelper<
  B extends AnyMappedBrand,
  Keys = KeysOfMappedBrand<B>,
  Values = ValuesOfMappedBrand<B>
> = {
  setBrand(obj: B): B;
  getBrand(): B;
  clone(): B;
  cloneWithHelper(): MappedBrandHelper<B>;
  has(key: Keys): boolean;
  get(key: Keys): Values | undefined;
  set<V extends Values>(key: Keys, value: V): V;
  delete(key: Keys): boolean;
  keys(): Keys[];
  values(): Values[];
  entries(): Array<[Keys, Values]>;
};
export function makeMappedBrandHelper<B extends AnyMappedBrand>({
  isNumbered,
  brand
}: {
  isNumbered?: (IsBrand<KeysOfMappedBrand<B>> extends true
  ? BaseOfBrand<KeysOfMappedBrand<B>>
  : KeysOfMappedBrand<B>) extends number
    ? true
    : false;
  brand?: B;
} = {}): MappedBrandHelper<B> {
  let obj: B = brand || (({} as any) as B);
  return {
    /* tslint:disable:typedef */
    setBrand(newObj) {
      obj = newObj;
      return obj;
    },
    getBrand() {
      return obj;
    },
    clone() {
      return { ...obj };
    },
    cloneWithHelper() {
      return makeMappedBrandHelper({ brand: { ...obj }, isNumbered });
    },
    has(key) {
      const k = `${key}`;
      return k in obj;
    },
    get(key) {
      const k = `${key}`;
      return k in obj ? obj[k] : undefined; // tslint:disable-line: no-unsafe-any
    },
    set(key, value) {
      const k = `${key}`;
      // HACK: typescript makeMappedBrandHelper -@thery at 6/17/2019, 4:36:10 PM
      // @ts-ignore
      obj[k] = value;
      return value;
    },
    delete(key) {
      const k = `${key}`;
      if (!(k in obj)) return false;
      delete obj[k]; // tslint:disable-line: no-dynamic-delete
      return true;
    },
    keys() {
      // tslint:disable-next-line: strict-boolean-expressions
      if (isNumbered) return Object.keys(obj).map(Number);
      else return Object.keys(obj);
    },
    values() {
      return Object.values(obj);
    },
    entries() {
      // tslint:disable-next-line: strict-boolean-expressions
      if (isNumbered) {
        return Object.entries(obj).map(([k, v]) => [Number(k), v]);
      } else {
        return Object.entries(obj);
      }
    }
    /* tslint:enable */
  };
}

type __MapAAA = MappedBrand<__BrandAAA, boolean>;
type __MapBBB = MappedBrand<__BrandBBB, { foo: 'bar' }>;
type __MapCCC = MappedBrand<string, boolean>;
type __MapDDD = MappedBrand<number, boolean>;

assertType<
  IsExact<
    MappedBrand<__BrandAAA, boolean>,
    { [K in number]: boolean } & { __mapped__: [__BrandAAA, boolean] }
  >
>(true);
assertType<
  IsExact<
    MappedBrand<__BrandBBB, boolean>,
    { [K in string]: boolean } & { __mapped__: [__BrandBBB, boolean] }
  >
>(true);
assertType<
  IsExact<
    MappedBrand<string, boolean>,
    { [K in string]: boolean } & { __mapped__: [string, boolean] }
  >
>(true);

assertType<IsExact<KeysOfMappedBrand<__MapAAA>, __BrandAAA>>(true);
assertType<IsExact<KeysOfMappedBrand<__MapBBB>, __BrandBBB>>(true);
assertType<IsExact<KeysOfMappedBrand<__MapCCC>, string>>(true);

assertType<IsExact<ValuesOfMappedBrand<__MapAAA>, boolean>>(true);
assertType<IsExact<ValuesOfMappedBrand<__MapBBB>, { foo: 'bar' }>>(true);
assertType<IsExact<ValuesOfMappedBrand<__MapCCC>, boolean>>(true);

assertType<IsExact<ValuesOfMappedBrand<__MapAAA>, boolean>>(true);
assertType<IsExact<ValuesOfMappedBrand<__MapBBB>, { foo: 'bar' }>>(true);
assertType<IsExact<ValuesOfMappedBrand<__MapCCC>, boolean>>(true);

assertType<IsExact<MappedBrander<__MapAAA>, () => __MapAAA>>(true);
assertType<
  IsExact<
    MappedBrander<__MapAAA>,
    (underlying?: Array<[__BrandAAA, boolean]>) => __MapAAA
  >
>(true);
assertType<
  IsExact<
    MappedBrander<__MapBBB>,
    (underlying?: Array<[__BrandBBB, { foo: 'bar' }]>) => __MapBBB
  >
>(true);
assertType<
  IsExact<
    MappedBrander<__MapCCC>,
    (underlying?: Array<[string, boolean]>) => __MapCCC
  >
>(true);

/**
 * MergeStrings — merge two strings but prefer the strongly typed ones.
 */
export type MergeStrongStrings<A extends string, B extends string> = A extends B
  ? A
  : B extends A
  ? B
  : never;
assertType<IsExact<MergeStrongStrings<'AAA', 'BBB'>, never>>(true);
assertType<IsExact<MergeStrongStrings<string, 'BBB'>, 'BBB'>>(true);
assertType<IsExact<MergeStrongStrings<'AAA', string>, 'AAA'>>(true);
assertType<IsExact<MergeStrongStrings<string, string>, string>>(true);

makeMappedBrandHelper<__MapAAA>({ isNumbered: true });
makeMappedBrandHelper<__MapBBB>({ isNumbered: false });
makeMappedBrandHelper<__MapCCC>({ isNumbered: false });
makeMappedBrandHelper<__MapDDD>({ isNumbered: true });
