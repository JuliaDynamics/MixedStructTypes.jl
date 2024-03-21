var documenterSearchIndex = {"docs":
[{"location":"api/#API","page":"API","title":"API","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"@compact_structs\n@sum_structs\nkindof\nallkinds\nkindconstructor","category":"page"},{"location":"api/#MixedStructTypes.@compact_structs","page":"API","title":"MixedStructTypes.@compact_structs","text":"@compact_structs(type_definition, structs_definitions)\n\nThis macro allows to combine multiple types in a single one.  This version has been built to yield a performance almost  identical to having just one type.\n\nExample\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\nSee the introduction page of the documentation for a more advanced example.\n\n\n\n\n\n","category":"macro"},{"location":"api/#MixedStructTypes.@sum_structs","page":"API","title":"MixedStructTypes.@sum_structs","text":"@sum_structs(type_definition, structs_definitions)\n\nThis macro allows to combine multiple types in a single one.  This version is slower than @compact_structs but it consumes less memory. See the ReadMe at https://github.com/JuliaDynamics/MixedStructTypes.jl of the package for an example of usage.\n\n\n\n\n\n","category":"macro"},{"location":"api/#MixedStructTypes.kindof","page":"API","title":"MixedStructTypes.kindof","text":"Return a symbol representing the conceptual type of an instance:\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1);\n\njulia> kindof(a)\n:A\n\n\n\n\n\n","category":"function"},{"location":"api/#MixedStructTypes.allkinds","page":"API","title":"MixedStructTypes.allkinds","text":"Return a Tuple containing all kinds associated with the overarching  type defined with @compact_structs or @sum_structs:\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> allkinds(AB)\n(:A, :B)\n\n\n\n\n\n","category":"function"},{"location":"api/#MixedStructTypes.kindconstructor","page":"API","title":"MixedStructTypes.kindconstructor","text":"Return the constructor of an instance:\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1);\n\njulia> kindconstructor(a)\nA\n\n\n\n\n\n","category":"function"},{"location":"","page":"Introduction","title":"Introduction","text":"This package allows to combine multiple heterogeneous types in a single one. This helps to write type-stable code by avoiding Union-splitting, which have big performance drawbacks when many types are unionized.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Two macros implement different strategies to create a compact representation of the types: @compact_structs and @sum_structs.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Both work very similarly, but there are some differences:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"@compact_structs is faster;\n@sum_structs is more memory efficient and allows to mix mutable and immutable structs where fields belonging to different structs can also have different types, it uses SumTypes.jl under the hood. ","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Even if there is only a unique type defined by these macros, you can access a symbol containing the conceptual type of an instance with the function kindof.","category":"page"},{"location":"#Example","page":"Introduction","title":"Example","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> using MixedStructTypes\n\njulia> abstract type AbstractA{X} end\n\njulia> @sum_structs A{X} <: AbstractA{X} begin\n           @kwdef mutable struct B{X}\n               a::Tuple{X, X} = (1,1)\n               b::Tuple{Float64, Float64} = (1.0, 1.0)\n           end\n           @kwdef mutable struct C\n               a::Tuple{Int, Int} = (2,2)\n               d::Int32 = Int32(2)\n           end\n           @kwdef mutable struct D\n               a::Tuple{Int, Int} = (3,3)\n               const c::Symbol = :s\n           end\n           @kwdef struct E{X}\n               a::Tuple{X, X} = (3,3)\n           end\n       end\n\njulia> b = B((1,1), (1.0, 1.0))\nB{Int64}((1, 1), (1.0, 1.0))::A\n\njulia> b.a\n(1, 1)\n\njulia> b.a = (3, 3)\n(3, 3)\n\njulia> kindof(b)\n:B\n\njulia> abstract type AbstractF{X} end \n\njulia> # as you can see, here, all structs are mutable\n       # and all shared fields in different structs have\n       # the same type\n\njulia> @compact_structs F{X} <: AbstractF{X} begin\n           @kwdef mutable struct G{X}\n               a::Tuple{X, X} = (1,1)\n               b::Tuple{Float64, Float64} = (1.0, 1.0)\n           end\n           @kwdef mutable struct H{X}\n               a::Tuple{X, X} = (2,2)\n               d::Int32 = Int32(2)\n           end\n           @kwdef mutable struct I{X}\n               a::Tuple{X, X} = (3,3)\n               const c::Symbol = :s\n           end\n           @kwdef mutable struct L{X}\n               a::Tuple{X, X} = (3,3)\n           end\n       end\n\njulia> g = G((1,1), (1.0, 1.0))\nG{Int64}((1, 1), (1.0, 1.0))::F\n\njulia> g.a\n(1, 1)\n\njulia> g.a = (3, 3)\n(3, 3)\n\njulia> kindof(g)\n:G","category":"page"},{"location":"#Benchmark","page":"Introduction","title":"Benchmark","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Let's see briefly how the two macros compare performance-wise in respect to a Union:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> @kwdef mutable struct M{X}\n           a::Tuple{X, X} = (1,1)\n           b::Tuple{Float64, Float64} = (1.0, 1.0)\n       end\n\njulia> @kwdef mutable struct N{X}\n           a::Tuple{X, X} = (2,2)\n           d::Int32 = Int32(2)\n       end\n\njulia> @kwdef mutable struct O{X}\n           a::Tuple{X, X} = (3,3)\n           const c::Symbol = :s\n       end\n\njulia> @kwdef mutable struct P{X}\n           a::Tuple{X, X} = (3,3)\n       end\n\njulia> vec_union = Union{M{Int},N{Int},O{Int},P{Int}}[rand((M,N,O,P))() for _ in 1:10^6];\n\njulia> vec_sum = A{Int}[rand((B,C,D,E))() for _ in 1:10^6];\n\njulia> vec_compact = F{Int}[rand((G,H,I,L))() for _ in 1:10^6];\n\njulia> Base.summarysize(vec_union)\n31994928\n\njulia> Base.summarysize(vec_sum)\n34925776\n\njulia> Base.summarysize(vec_compact)\n75643452\n\njulia> using BenchmarkTools\n\njulia> @btime sum(x.a[1] for x in $vec_union);\n  26.268 ms (999780 allocations: 15.26 MiB)\n\njulia> @btime sum(x.a[1] for x in $vec_sum);\n  6.301 ms (0 allocations: 0 bytes)\n\njulia> @btime sum(x.a[1] for x in $vec_compact);\n  2.911 ms (0 allocations: 0 bytes)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"In this case, @compact_structs is almost 10 times faster than a Union, even if it requires double the memory.  Whereas, as expected, @sum_structs is less time efficient than @compact_structs, but it uses nearly the same  memory of a Union.","category":"page"}]
}
