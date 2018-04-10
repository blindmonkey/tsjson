# TsJson

Do you have a JavaScript object, perhaps loaded from a file or entered by a user? Do you need to assert that the object has some properties of certain types? If so, then you've come to the right place.

**TsJson** is a TypeScript library that takes things of type `any` and transforms them into whatever type you need, enforced by TypeScript.

## Basic examples

Here are some examples of how one can use **TsJson**. These examples are TypeScript code where a variable of type `any` is assigned a value. In the examples, this value is hardcoded but it can come from wherever.

```
const TestValue: any = {
  "hello": "world",
  "numeric": 3,
  "subobject": {
    "x": [1, 2, 3],
    "enum": 'valid'
  }
}

const TestReader = TsJson.obj()
  .prop('hello', TsJson.string)
  .prop('numeric', TsJson.number)
  .prop('subobject', TsJson.obj()
    .prop('x', TsJson.array(TsJson.number))
    .prop('enum', TsJson.enumeration()
      .case('valid').case('invalid')
    )
  );

const TypedValue = TestReader.read(TestValue);
```

In this example, `TypedValue` has the inferred type:
```
Result<{
  hello: string,
  numeric: number,
  subobject: {
    x: number[],
    enum: 'valid'|'invalid'
  }
}, TsJson.Error.DecodingError>
```
The `Result` wrapper simply helps us handle errors sensibly. The important part is that once the object is unwrapped, you get all the benefits of TypeScript, including autocompletion. If any of the properties failed to decode, then the whole read fails.

# Building

To configure the build environment, run `npm i --dev` to install all the dependencies.
Then run `npm run build` to build the project into the `dist` directory.
