# Frida Generate
Frida script generator,multiple scripts combind to one.

# Usage

## include filename
The `import` must be single line.
```javascript
import '../FridaScript/BaseHook.js';
```
## Combine
`frida-g <entry script> [options]`

## options
- `-o|--output`:Outputfile name
- `-w|--watch`:Watching encry script modify