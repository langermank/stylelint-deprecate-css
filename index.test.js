const { messages, ruleName } = require("./index.js");

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: [
    "DEPRECATED_MIXINS",
    ".myMixin",
    "DEPRECATED_STYLES",
    ".myStyle",
    "DEPRECATED_VARIABLES",
    "@hello",
  ],
  fix: false,

  // accept: [
  //   {
  //     code: ".class {}",
  //     description: "simple class selector"
  //   },
  //   {
  //     code: ".class { .someMixin() }",
  //     description: "some mixin"
  //   }
  // ],

  reject: [
    {
      code: ".myStyle {}",
      // fixed: ".my-class {}",
      description: "test",
      // message: messages.unexpected(),
      // line: 1,
      // column: 1,
      unfixable: true,
      warnings: [
            {
              message: messages.unexpected(),
              line: 1,
              column: 1
            },
      ]
    },
    // {
    //   code: ".MyClass,\n.MyOtherClass {}",
    //   fixed: ".my-class,\n.my-other-class {}",
    //   description: "two pascal class selectors in a selector list",
    //   warnings: [
    //     {
    //       message: messages.unexpected(),
    //       line: 1,
    //       column: 1
    //     },
    //     {
    //       message: messages.unexpected(),
    //       line: 2,
    //       column: 1
    //     }
    //   ]
    // }
  ]
});