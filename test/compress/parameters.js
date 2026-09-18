arrow_functions: {
    options = {
        arrows: true,
    }
    input: {
        (a) => b;  // 1 args
        (a, b) => c;  // n args
        () => b;  // 0 args
        (a) => (b) => c;  // func returns func returns func
        (a) => ((b) => c);  // So these parens are dropped
        () => (b,c) => d;  // func returns func returns func
        a=>{return b;}
        a => 'lel';  // Dropping the parens
    }
    expect_exact: "a=>b;(a,b)=>c;()=>b;a=>b=>c;a=>b=>c;()=>(b,c)=>d;a=>b;a=>\"lel\";"
}

arrow_return: {
    options = {
        arrows: true,
    }
    input: {
        () => {};
        () => { return; };
        a => { return 1; }
        a => { return -b }
        a => { return b; var b; }
        (x, y) => { return x - y; }
    }
    expect_exact: "()=>{};()=>{};a=>1;a=>-b;a=>{return b;var b};(x,y)=>x-y;"
}

regression_arrow_functions_and_hoist: {
    options = {
        hoist_vars: true,
        hoist_funs: true
    }
    input: {
        (a) => b;
    }
    expect_exact: "a=>b;"
}

regression_assign_arrow_functions: {
    input: {
        oninstall = e => false;
        oninstall = () => false;
    }
    expect: {
        oninstall=e=>false;
        oninstall=()=>false;
    }
}

destructuring_arguments_1: {
    input: {
        (function ( a ) { });
        (function ( [ a ] ) { });
        (function ( [ a, b ] ) { });
        (function ( [ [ a ] ] ) { });
        (function ( [ [ a, b ] ] ) { });
        (function ( [ a, [ b ] ] ) { });
        (function ( [ [ b ], a ] ) { });

        (function ( { a } ) { });
        (function ( { a, b } ) { });

        (function ( [ { a } ] ) { });
        (function ( [ { a, b } ] ) { });
        (function ( [ a, { b } ] ) { });
        (function ( [ { b }, a ] ) { });

        ( [ a ] ) => { };
        ( [ a, b ] ) => { };

        ( { a } ) => { };
        ( { a, b, c, d, e } ) => { };

        ( [ a ] ) => b;
        ( [ a, b ] ) => c;

        ( { a } ) => b;
        ( { a, b } ) => c;
    }
    expect: {
        (function(a){});
        (function([a]){});
        (function([a,b]){});
        (function([[a]]){});
        (function([[a,b]]){});
        (function([a,[b]]){});
        (function([[b],a]){});

        (function({a}){});
        (function({a,b}){});

        (function([{a}]){});
        (function([{a,b}]){});
        (function([a,{b}]){});
        (function([{b},a]){});

        ([a])=>{};
        ([a,b])=>{};

        ({a})=>{};
        ({a,b,c,d,e})=>{};

        ([a])=>b;
        ([a,b])=>c;

        ({a})=>b;
        ({a,b})=>c;
    }
}

destructuring_arguments_2: {
    input: {
        (function([]) {});
        (function({}) {});
        (function([,,,,,]) {});
        (function ([a, {b: c}]) {});
        (function ([...args]) {});
        (function ({x,}) {});
        class a { *method({ [thrower()]: x } = {}) {}};
        (function(a, b, c, d, [{e: [...f]}]){})(1, 2, 3, 4, [{e: [1, 2, 3]}]);
    }
    expect: {
        (function([]) {});
        (function({}) {});
        (function([,,,,,]) {});
        (function ([a, {b: c}]) {});
        (function ([...args]) {});
        (function ({x,}) {});
        class a { *method({ [thrower()]: x } = {}) {}};
        (function(a, b, c, d, [{e: [...f]}]){})(1, 2, 3, 4, [{e: [1, 2, 3]}]);
    }
}

destructuring_arguments_3: {
    beautify = {
        ecma: 2015
    }
    input: {
        function fn3({x: {y: {z: {} = 42}}}) {}
        const { a = (function () {}), b = (0, function() {})  } = {};
        let { c = (function () {}), d = (0, function() {})  } = {};
        var { e = (function () {}), f = (0, function() {})  } = {};
    }
    expect_exact: "function fn3({x:{y:{z:{}=42}}}){}const{a=function(){},b=(0,function(){})}={};let{c=function(){},d=(0,function(){})}={};var{e=function(){},f=(0,function(){})}={};"
}

destructuring_parameters_get_set: {
    beautify = {
        ecma: 2015
    }
    input: {
        function default_get({ get = "PASS" }) { return get }
        function default_set({ set = "PASS" }) { return set }
        const default_get_arrow = ({ get = "PASS" }) => { return get }
        const default_set_arrow = ({ set = "PASS" }) => { return set }

        console.log(default_get({}))
        console.log(default_set({}))
        console.log(default_get_arrow({}))
        console.log(default_set_arrow({}))
    }
    expect_stdout: [
        "PASS",
        "PASS",
        "PASS",
        "PASS",
    ]
}

default_arguments: {
    beautify = {
        ecma: 2015
    }
    input: {
        function x(a = 6) { }
        function x(a = (6 + 5)) { }
        function x({ foo } = {}, [ bar ] = [ 1 ]) { }
    }
    expect_exact: "function x(a=6){}function x(a=6+5){}function x({foo}={},[bar]=[1]){}"
}

keep_default_arg_when_undefined: {
    options = {
        keep_fargs: true,
        evaluate: true,
    }
    input: {
        function x(a = void 0) { }
        console.log(x.length)
    }
    expect: {
        function x(a = void 0) { }
        console.log(x.length)
    }
}

drop_default_arg_when_undefined_and_iife: {
    options = {
        keep_fargs: true,
        evaluate: true,
    }
    input: {
        console.log((function x(a = void 0) { })())
    }
    expect: {
        console.log((function x(a) { })())
    }
}

default_values_in_destructurings: {
    beautify = {
        ecma: 2015
    }
    input: {
        function x({a=(4), b}) {}
        function x([b, c=(12)]) {}
        var { x = (6), y } = x;
        var [ x, y = (6) ] = x;
    }
    expect_exact: "function x({a=4,b}){}function x([b,c=12]){}var{x=6,y}=x;var[x,y=6]=x;"
}

accept_duplicated_parameters_in_non_strict_without_spread_or_default_assignment: {
    input: {
        function a(b, b){}
        function b({c: test, c: test}){}
    }
    expect: {
        function a(b, b){}
        function b({c: test, c: test}){}
    }
}

accept_destructuring_async_word_with_default: {
    input: {
        console.log((({ async = "PASS" }) => async)({}))
    }
    expect_stdout: "PASS"
}

issue_default_param_shadowed_by_body_var: {
    mangle = { }
    input: {
        function f(a, g = () => a) {
            var a = 42;
            return g();
        }
        console.log(f(1));
    }
    expect_stdout: "1"
}

issue_default_param_shadowed_by_body_var_value: {
    mangle = { }
    input: {
        function f(a, b = a) {
            var a = 42;
            return b;
        }
        console.log(f(99));
    }
    expect_stdout: "99"
}

issue_default_param_shadowed_by_body_function: {
    mangle = { }
    input: {
        function f(a, g = () => a) {
            function a() {
                return 5;
            }
            return g();
        }
        console.log(f(1));
    }
    expect_stdout: "1"
}

issue_default_param_nested_arrow: {
    mangle = { }
    input: {
        function f(a, g = (() => () => a)()) {
            var a = 42;
            return g();
        }
        console.log(f(1));
    }
    expect_stdout: "1"
}

issue_default_param_refs_outer_const: {
    mangle = { }
    input: {
        const g = () => 7;
        function f(a, x = g()) {
            const g = 1;
            return x;
        }
        console.log(f(1));
    }
    expect_stdout: "7"
}

issue_default_param_refs_outer_var: {
    mangle = { }
    input: {
        var g = () => 7;
        function f(a, x = g()) {
            var g = 1;
            return x;
        }
        console.log(f(1));
    }
    expect_stdout: "7"
}

issue_default_param_refs_outer_function_declaration: {
    mangle = { }
    input: {
        function g() {
            return 7;
        }
        function f(a, x = g()) {
            function g() {
                return 1;
            }
            return x;
        }
        console.log(f(1));
    }
    expect_stdout: "7"
}

issue_default_param_body_binding_still_usable: {
    mangle = { }
    input: {
        function f(a, g = () => a) {
            var a = 1;
            return (() => a)() + g();
        }
        console.log(f(100));
    }
    expect_stdout: "101"
}

issue_default_param_shadowing_multiple_params: {
    mangle = { }
    input: {
        function f(a, b, g = () => [a, b].join(",")) {
            var a = 1;
            var b = 2;
            return g();
        }
        console.log(f(10, 20));
    }
    expect_stdout: "10,20"
}

issue_default_param_arrow_function_form: {
    mangle = { }
    input: {
        var g = () => 7;
        var f = (a, x = g()) => {
            var g = 1;
            return x;
        };
        console.log(f(1));
    }
    expect_stdout: "7"
}

issue_default_param_refs_outer_class: {
    mangle = { }
    input: {
        var G = 7;
        function f(a, x = G) {
            class G {}
            return x;
        }
        console.log(f(1));
    }
    expect_stdout: "7"
}

issue_default_param_nested_destructuring_default: {
    mangle = { }
    input: {
        function f([a], { b = a } = {}) {
            var a = 8;
            return b;
        }
        console.log(f([3]));
    }
    expect_stdout: "3"
}

issue_default_param_nested_function_body_shadow: {
    mangle = { }
    input: {
        function outer(p, make = (a, g = () => p) => {
            var p = 9;
            return g();
        }) {
            var p = 99;
            return make(5);
        }
        console.log(outer(1));
    }
    expect_stdout: "1"
}
