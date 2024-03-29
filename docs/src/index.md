This package allows to combine multiple heterogeneous types in a single one. This helps to write type-stable code
by avoiding Union-splitting, which have big performance drawbacks when many types are unionized.

Two macros implement different strategies to create a compact representation of the types: `@compact_structs` and
`@sum_structs`.

Both work very similarly, but there are some differences:

- `@compact_structs` is faster;

- `@sum_structs` is more memory efficient and allows to mix mutable and immutable structs where fields belonging to different structs can also have different types, it uses [SumTypes.jl](https://github.com/MasonProtter/SumTypes.jl) under the hood. 

Even if there is only a unique type defined by these macros, you can access a symbol containing the conceptual type
of an instance with the function `kindof`.

## Example

```julia
julia> using MixedStructTypes

julia> abstract type AbstractA{X} end

julia> @sum_structs A{X} <: AbstractA{X} begin
           @kwdef mutable struct B{X}
               a::Tuple{X, X} = (1,1)
               b::Tuple{Float64, Float64} = (1.0, 1.0)
           end
           @kwdef mutable struct C
               a::Tuple{Int, Int} = (2,2)
               d::Int32 = Int32(2)
           end
           @kwdef mutable struct D
               a::Tuple{Int, Int} = (3,3)
               const c::Symbol = :s
           end
           @kwdef struct E{X}
               a::Tuple{X, X} = (3,3)
           end
       end

julia> b = B((1,1), (1.0, 1.0))
B{Int64}((1, 1), (1.0, 1.0))::A

julia> b.a
(1, 1)

julia> b.a = (3, 3)
(3, 3)

julia> kindof(b)
:B

julia> abstract type AbstractF{X} end 

julia> # as you can see, here, all structs are mutable
       # and all shared fields in different structs have
       # the same type

julia> @compact_structs F{X} <: AbstractF{X} begin
           @kwdef mutable struct G{X}
               a::Tuple{X, X} = (1,1)
               b::Tuple{Float64, Float64} = (1.0, 1.0)
           end
           @kwdef mutable struct H{X}
               a::Tuple{X, X} = (2,2)
               d::Int32 = Int32(2)
           end
           @kwdef mutable struct I{X}
               a::Tuple{X, X} = (3,3)
               const c::Symbol = :s
           end
           @kwdef mutable struct L{X}
               a::Tuple{X, X} = (3,3)
           end
       end

julia> g = G((1,1), (1.0, 1.0))
G{Int64}((1, 1), (1.0, 1.0))::F

julia> g.a
(1, 1)

julia> g.a = (3, 3)
(3, 3)

julia> kindof(g)
:G
```

## Benchmark

Let's see briefly how the two macros compare performance-wise in respect to a `Union`:

```julia
julia> @kwdef mutable struct M{X}
           a::Tuple{X, X} = (1,1)
           b::Tuple{Float64, Float64} = (1.0, 1.0)
       end

julia> @kwdef mutable struct N{X}
           a::Tuple{X, X} = (2,2)
           d::Int32 = Int32(2)
       end

julia> @kwdef mutable struct O{X}
           a::Tuple{X, X} = (3,3)
           const c::Symbol = :s
       end

julia> @kwdef mutable struct P{X}
           a::Tuple{X, X} = (3,3)
       end

julia> vec_union = Union{M{Int},N{Int},O{Int},P{Int}}[rand((M,N,O,P))() for _ in 1:10^6];

julia> vec_sum = A{Int}[rand((B,C,D,E))() for _ in 1:10^6];

julia> vec_compact = F{Int}[rand((G,H,I,L))() for _ in 1:10^6];

julia> Base.summarysize(vec_union)
31994928

julia> Base.summarysize(vec_sum)
34925776

julia> Base.summarysize(vec_compact)
75643452

julia> using BenchmarkTools

julia> @btime sum(x.a[1] for x in $vec_union);
  26.268 ms (999780 allocations: 15.26 MiB)

julia> @btime sum(x.a[1] for x in $vec_sum);
  6.301 ms (0 allocations: 0 bytes)

julia> @btime sum(x.a[1] for x in $vec_compact);
  2.911 ms (0 allocations: 0 bytes)
```

In this case, `@compact_structs` is almost 10 times faster than a `Union`, even if it requires double the memory. 
Whereas, as expected, `@sum_structs` is less time efficient than `@compact_structs`, but it uses nearly the same 
memory of a `Union`.
