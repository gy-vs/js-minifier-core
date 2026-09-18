// Default parameter initialisers are evaluated in the parameters
// environment, which is distinct from the function body environment.
// A name referenced from a parameter expression must therefore
// resolve to a parameter or an outer binding, never to a binding
// created in the body, even when the names coincide.
// https://tc39.es/ecma262/#sec-functiondeclarationinstantiation

default_refs_body_shadowed_parameter_var: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        function f(a, b = () => a) {
            var a = 1;
            return b();
        }
        console.log(f(42));
    }
    expect_stdout: "42"
}

default_refs_body_shadowed_parameter_simple: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        function f(a, b = a) {
            var a = 1;
            return b;
        }
        console.log(f(42));
    }
    expect_stdout: "42"
}

default_refs_outer_binding_shadowed_by_const: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        const x = () => 1;
        function f(a = x()) {
            const x = 2;
            return a;
        }
        try {
            console.log(f());
        } catch (e) {
            console.log(e.constructor.name);
        }
    }
    expect_stdout: "1"
}

default_refs_outer_binding_shadowed_by_var: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        var y = () => 3;
        function f(a = y()) {
            var y = 4;
            return a;
        }
        try {
            console.log(f());
        } catch (e) {
            console.log(e.constructor.name);
        }
    }
    expect_stdout: "3"
}

default_refs_outer_binding_shadowed_by_var_arrow: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        var y = 3;
        var f = (a = (() => y)()) => {
            var y = 4;
            return a;
        };
        console.log(f());
    }
    expect_stdout: "3"
}

default_refs_body_function_declaration_no_outer: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        function f(p, b = a) {
            function a() {
                return 6;
            }
            return b;
        }
        try {
            console.log(f());
        } catch (e) {
            console.log(e.constructor.name);
        }
    }
    expect_stdout: "ReferenceError"
}

default_refs_body_function_declaration_with_outer: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        var a = 1;
        function f(p, b = a) {
            function a() {
                return 6;
            }
            return b;
        }
        console.log(f());
    }
    expect_stdout: "1"
}

default_refs_nested_function_free_identifier: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        var b = 9;
        function f(a = (function() {
            return b;
        })()) {
            var b = 1;
            return a;
        }
        console.log(f());
    }
    expect_stdout: "9"
}

default_refs_nested_arrow_captures_parameter: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        function f(a, b = (() => () => a)()) {
            var a = 1;
            return b();
        }
        console.log(f(55));
    }
    expect_stdout: "55"
}

default_refs_destructured_parameter_shadowed: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        (function() {
            function f(o, { a: x } = o) {
                var o = 1;
                console.log(x);
            }
            f({ a: "PASS" });
        })();
    }
    expect_stdout: "PASS"
}

default_refs_rest_parameter_shadowed: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        function f(a, ...rest) {
            var a = 5;
            console.log(a, rest[0]);
        }
        f(1, 2);
    }
    expect_stdout: "5 2"
}

default_refs_block_scoped_outer_shadow: {
    options = {
        defaults: true,
    }
    mangle = {
    }
    input: {
        var q = 9;
        function f(a = q) {
            {
                let q = 1;
            }
            return a;
        }
        console.log(f());
    }
    expect_stdout: "9"
}
