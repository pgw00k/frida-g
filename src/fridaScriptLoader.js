const fs = require('fs');
const path = require('path');

class fridaScriptLoader {
    //static regexImport = /include\(["'']{1}([\S\s]*?)(\.js)*['""]{1}\);?[\n\r]+/g;
    static regexImport = /import\s*['"]{1}([\S\s]*?)['"]{1}[\s;]*[\n\r]+/g;

    loaders = new Map();

    static loadScript(filePath) {
        let loader = new fridaScriptLoader(filePath);
        return loader;
    }

    constructor(filePath) {
        this.subScripts = [];
        this.searchDirectories = [];

        this.searchDirectories.concat(module.paths);
        this.searchDirectories.push(path.dirname(path.resolve(filePath)))

        this.text = fs.readFileSync(filePath, 'utf8');
        this.text = this.text.replace(fridaScriptLoader.regexImport, this.importOtherJavaScript.bind(this));
    }

    importOtherJavaScript(match, group1) {
        let ext = path.extname(group1);

        for(let i = 0;i<this.searchDirectories.length;i++)
        {
            const filePath = path.resolve(this.searchDirectories[i], `${ext?group1:group1+'.js'}`);
            if (fs.existsSync(filePath)) {
                const subLoader = fridaScriptLoader.loadScript(filePath);
                this.subScripts.push(subLoader);
                break;
            }
        }        
        return ''; // 替换为空字符串
    }

    generateFinalText(){
        let loaders = [];
        this.getAllSubScript(loaders);
        loaders = [...new Set(loaders.reverse())]; // 去重

        let pre = '';
        loaders.forEach(sub => {
            pre += `${sub.text}\n`;
        });

        return pre + this.text;
    }

    get finalText() {
        if (!this._finalText) {
            this._finalText = this.generateFinalText();
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
