const fs = require('fs');
const path = require('path');

class fridaScriptLoader {
    static regexImport = /include\(["'']{1}([\S\s]*?)(\.js)*['""]{1}\);?[\n\r]+/g;

    loaders = new Map();

    static loadScript(filePath) {
        let loader = new fridaScriptLoader(filePath);
        return loader;
    }

    constructor(filePath) {
        this.subScripts = [];
        this.searchRoot = path.dirname(path.resolve(filePath));

        this.text = fs.readFileSync(filePath, 'utf8');
        this.text = this.text.replace(fridaScriptLoader.regexImport, this.importOtherJavaScript.bind(this));
    }

    importOtherJavaScript(match, group1) {
        const filePath = path.resolve(this.searchRoot, `${group1}.js`);
        if (fs.existsSync(filePath)) {
            const subLoader = fridaScriptLoader.loadScript(filePath);
            this.subScripts.push(subLoader);
        }
        return ''; // 替换为空字符串
    }

    get finalText() {
        if (!this._finalText) {
            let loaders = [];
            this.getAllSubScript(loaders);
            loaders = [...new Set(loaders.reverse())]; // 去重

            let pre = '';
            loaders.forEach(sub => {
                pre += `${sub.text}\n`;
            });

            this._finalText = pre + this.text;
        }
        return this._finalText;
    }

    getAllSubScript(subScriptList) {
        this.subScripts.forEach(sub => {
            subScriptList.push(sub);
            sub.getAllSubScript(subScriptList);
        });
    }

    toString() {
        return this.text;
    }
}

module.exports = fridaScriptLoader;
