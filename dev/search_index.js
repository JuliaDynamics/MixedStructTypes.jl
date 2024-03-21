var documenterSearchIndex = {"docs":
[{"location":"#API","page":"API","title":"API","text":"","category":"section"},{"location":"","page":"API","title":"API","text":"@compact_structs\n@sum_structs\nkindof\nallkinds\nkindconstructor","category":"page"},{"location":"#MixedStructTypes.@compact_structs","page":"API","title":"MixedStructTypes.@compact_structs","text":"@compact_structs(type_definition, structs_definitions)\n\nCombine multiple types in a single one offered by the package.  This version is optimized to yield a better performance than @sum_structs.\n\n\n\n\n\n","category":"macro"},{"location":"#MixedStructTypes.@sum_structs","page":"API","title":"MixedStructTypes.@sum_structs","text":"@sum_structs(type_definition, structs_definitions)\n\nCombine multiple types in a single one offered by the package.  This version is optimized to yield a better memory usage than @compact_structs.\n\n\n\n\n\n","category":"macro"},{"location":"#MixedStructTypes.kindof","page":"API","title":"MixedStructTypes.kindof","text":"Return a symbol representing the conceptual type of an instance:\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1);\n\njulia> kindof(a)\n:A\n\n\n\n\n\n","category":"function"},{"location":"#MixedStructTypes.allkinds","page":"API","title":"MixedStructTypes.allkinds","text":"Return a Tuple containing all kinds associated with the overarching  type defined with @compact_structs or @sum_structs:\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> allkinds(AB)\n(:A, :B)\n\n\n\n\n\n","category":"function"},{"location":"#MixedStructTypes.kindconstructor","page":"API","title":"MixedStructTypes.kindconstructor","text":"Return the constructor of an instance:\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1);\n\njulia> kindconstructor(a)\nA\n\n\n\n\n\n","category":"function"}]
}