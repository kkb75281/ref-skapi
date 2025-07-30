# Getting Started

## Credentials

Service ID: xxxxxxxxx

Owner ID: xxx-xxx-xxx...

## For AI-Driven Development

Skapi works seamlessly with AI-driven development environments like OpenAI's Codex and Anthropic's Claude.

Simply download the necessary markdown files below to your project folder:

**Download:&nbsp;** 
<a href="https://docs.skapi.com/skapi.md" download="skapi.md">skapi.md</a> | 
<a href="https://docs.skapi.com/skapi-types.md" download="skapi-types.md">skapi-types.md</a> | 
<a href="https://docs.skapi.com/SYSTEM.md" download="SYSTEM.md">SYSTEM.md</a>

**Important:**
Rename the `SYSTEM.md` file to an appropriate filename that your coding assistant recognizes.

(e.g., `AGENT.md` for OpenAI Codex, `CLAUDE.md` for Anthropic Claude) 

## For HTML Projects
Add the following code to your HTML website to get started:

```html
<script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
<script>
    const skapi = new Skapi("ap21sOg7VTc5N3y4xckv", "4d4a36a5-b318-4093-92ae-7cf11feae989");
</script>
```

## For SPA Projects
If you are developing a Single Page Application (SPA), please refer to the following steps:

1. Install the library

```bash
npm install skapi-js
```

2. Initialize Skapi from your main.js

```js
// main.js
import { Skapi } from "skapi-js"
const skapi = new Skapi("ap21sOg7VTc5N3y4xckv", "4d4a36a5-b318-4093-92ae-7cf11feae989");
export { skapi } // Import the instance in your components
```