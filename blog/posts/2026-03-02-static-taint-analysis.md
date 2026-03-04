# Static taint analysis for LLM agents

## The DeepClause Approach

This is the same class of problem that Google’s [CaMeL paper](https://arxiv.org/abs/2503.18813) (Debenedetti et al., 2025) tackles with runtime taint tracking: they wrap a protective layer around the LLM that separates control flow from data flow, preventing untrusted content from influencing program behavior. It’s a good approach. But because DML compiles to a real language with formal semantics, we can do something complementary: catch these flows statically using taint analysis. This can be done at compile time, before the agent ever runs.

This post explains how that works.

## Source-Sink Tracking

The idea behind taint analysis is borrowed from traditional security research (SQL injection, XSS — same family of bugs). You identify sources (places where untrusted data enters the system) and sinks (places where that data can cause harm). Then you track whether tainted data can flow from any source to any sink.

In DeepClause, **sources** are:
- `param/2` — parameters passed in from outside
- `input/2` — direct user input
- `user/1` — user messages added to memory
- Task outputs — anything an LLM generates (yes, LLM output is untrusted too)
- Tool and agent arguments — data flowing through `exec/2`

And **sinks** are:
- `system/1` — the system prompt (severity: high). Tainted data here means prompt injection.
- `exec/2` with dangerous tools — executing code via `vm_exec`, `shell_exec`, or `eval` (severity: critical). Tainted data here means command injection.
- `task/N` memory — when a task inherits tainted conversation history (severity: medium). More subtle, but still a vector.

The analyzer walks through every clause in your DML program and builds a map of which variables are tainted and how they flow.

## Implementing This in Prolog

The nice thing about DML being Prolog is that the analyzer is also Prolog — and Prolog turns out to be unusually well-suited for this kind of work. Taint propagation is just pattern matching over terms: if a `format/3` call contains a tainted variable, its output variable is tainted. If an assignment `X = Y` has a tainted right-hand side, X is tainted. If a `string_concat` involves a tainted argument, the result is tainted. Each of these rules is a single Prolog clause. 

The analyzer applies them in a fixed-point loop — keep propagating until nothing new gets tainted — which handles multi-hop chains automatically.

What makes this particularly clean is that Prolog’s backtracking gives you exhaustive search for free. The analyzer doesn’t need to manually enumerate paths — it defines what a vulnerability looks like (tainted variable reaching a sink), and Prolog finds every instance. 

Prolog itself does not have global variables, therefore the DeepClause meta-interpreter has to track the LLM memory across the execution. This lets us extend the analyzer to catch implicit taint through memory. When `user(UserMsg)` adds untrusted input to the conversation history and a subsequent `task()` inherits that history, the analyzer flags it as a medium-severity risk — the LLM will see the tainted message in its context.

## Two Layers of Defense

Static analysis catches the obvious stuff at compile time. But some vulnerabilities only make sense in context — is this tool supposed to have access to user data? Is this system prompt intentionally parameterized?

So DeepClause also has an LLM-based audit layer. After the static analyzer runs, you can optionally pass its findings to a language model configured as a “senior security engineer.”

```javascript
const result = await compileToDML(source, { 
    analyze: true, // Run static analysis 
    audit: true, // Run LLM security audit 
    model: 'gpt-4o', 
    provider: 'openai' 
}); 

if (result.analysis?.warnings.length) { 
    console.log('Security warnings:', result.analysis.warnings); 
} 
if (result.analysis?.auditorReport) { 
    console.log('Audit report:', result.analysis.auditorReport); 
}
```

Two different tools for two different jobs. Prolog handles the data flow analysis — deterministic, exhaustive. The LLM handles the contextual judgment. They complement each other nicely.

## What’s Next

The analyzer is still young. There are things I want to add:
- Inter-procedural analysis: Right now each clause is analyzed independently. Tracking taint across predicate calls would catch more complex flows.
- Sanitization detection: If you explicitly validate or sanitize input before using it, the analyzer should recognize that and suppress the warning.
- Configurable policies: Different agents have different threat models. A public-facing chatbot needs stricter checks than an internal automation tool.

If you want to try it, the analysis runs automatically when you compile with the `--analyze` flag:

```bash
deepclause compile my-agent.md --analyze
```

Or programmatically:

```javascript
import { analyzeDML } from 'deepclause-sdk'; 

const result = await analyzeDML(dmlCode); 
for (const warning of result.warnings) { 
    console.log(`[${warning.level.toUpperCase()}] ${warning.message}`); 
}
```

The code is open source. The analyzer is ~200 lines of Prolog. If you find a taint flow it misses, I’d genuinely love to hear about it.

---

### LaTeX Test Section

Here is a block math equation to test KaTeX rendering:

$$
\mathcal{L}(\theta) = -\frac{1}{N} \sum_{i=1}^{N} \log p_\theta(y_i | x_i)
$$

And an inline equation: \( E = mc^2 \).
