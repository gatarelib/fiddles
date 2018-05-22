// Note that for webassembly.studio we're using the CLI's `--no-modules` option
// which may not be what you're using locally (aka using ES modules/Webpack).
// Since we're using `--no-modules` the `wasm_bindgen` global is initialized 
// to the exports of our module, and then below initialization is slightly
// different.
//
// When using wasm-bindgen locally and a different bundler like Webpack (or 
// a different option like `--nodejs`) these integration points will be
// tweaked slightly, and you can consult https://github.com/rustwasm/wasm-bindgen
// for more information.

const mod = wasm_bindgen;
counters =[];
function runApp() {
  addCounter();
  let b = document.getElementById('add-counter');
  if (!b) throw new Error('Unable to find #add-counter');
  b.addEventListener('click', ev => addCounter())
}


function addCounter() {
    let ctr = mod.Counter.new(randomChar(), 0);
    counters.push(ctr);
    update();
}

function update() {
    let container = document.getElementById('container');
    if (!container) throw new Error('Unable to find #container in dom');
    while (container.hasChildNodes()) {
        if (container.lastChild.id == "add-counter") break;
        container.removeChild(container.lastChild);
    }
    for (var i = 0; i < counters.length; i++) {
        let counter = counters[i];
        container.appendChild(newCounter(counter.key(), counter.count(), ev => {
            counter.increment();
            update();
        }))
    }
}

function randomChar() {
    console.log('randomChar');
    let idx = Math.floor(Math.random() * (chars.length - 1));
    console.log('index', idx);
    let ret = chars.splice(idx, 1)[0];
    console.log('char', ret);
    return ret;
}

function newCounter(key, value, cb) {
    let container = document.createElement('div');
    container.setAttribute('class', 'counter');
    let title = document.createElement('h1');
    title.appendChild(document.createTextNode('Counter ' + key));
    container.appendChild(title);
    container.appendChild(newField('Count', value));
    let plus = document.createElement('button');
    plus.setAttribute('type', 'button');
    plus.setAttribute('class', 'plus-button');
    plus.appendChild(document.createTextNode('+'));
    plus.addEventListener('click', cb);
    container.appendChild(plus);
    return container;
}

function newField(key, value) {
    let ret = document.createElement('div');
    ret.setAttribute('class', 'field');
    let name = document.createElement('span');
    name.setAttribute('class', 'name');
    name.appendChild(document.createTextNode(key));
    ret.appendChild(name);
    let val = document.createElement('span');
    val.setAttribute('class', 'value');
    val.appendChild(document.createTextNode(value));
    ret.appendChild(val);
    return ret;
}

// Load and instantiate the wasm file, and we specify the source of the wasm
// file here. Once the returned promise is resolved we're ready to go and
// use our imports.
wasm_bindgen('../out/main_bg.wasm').then(runApp);


let chars = [
"!","#","$","%","&","'","(",")","*","+",",",
"-",".","/","0","1","2","3","4","5","6","7",
"8","9",":",";","<","=",">","?","@","A","B",
"C","D","E","F","G","H","I","J","K","L","M",
"N","O","P","Q","R","S","T","U","V","W","X",
"Y","Z","[","]","^","_","`","a","b","c",
"d","e","f","g","h","i","j","k","l","m","n",
"o","p","q","r","s","t","u","v","w","x","y",
"z","{","|","}","~"," ","¡","¢","£","¤","¥",
"¦","§","¨","©","ª","«","¬","®","¯","°",
"±","²","³","´","µ","¶","·","¸","¹","º","»",
"¼","½","¾","¿","À","Á","Â","Ã","Ä","Å","Æ",
"Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ",
"Ò","Ó","Ô","Õ","Ö","×","Ø","Ù","Ú","Û","Ü",
"Ý","Þ","ß","à","á","â","ã","ä","å","æ","ç",
"è","é","ê","ë","ì","í","î","ï","ð","ñ","ò",
"ó","ô","õ","ö","÷","ø","ù","ú","û","ü","ý",
"þ","ÿ","Ā","ā","Ă","ă","Ą","ą","Ć","ć","Ĉ",
"ĉ","Ċ","ċ","Č","č","Ď","ď","Đ","đ","Ē","ē",
"Ĕ","ĕ","Ė","ė","Ę","ę","Ě","ě","Ĝ","ĝ","Ğ",
"ğ","Ġ","ġ","Ģ","ģ","Ĥ","ĥ","Ħ","ħ","Ĩ","ĩ",
"Ī","ī","Ĭ","ĭ","Į","į","İ","ı","Ĳ","ĳ","Ĵ",
"ĵ","Ķ","ķ","ĸ","Ĺ","ĺ","Ļ","ļ","Ľ","ľ","Ŀ",
"ŀ","Ł","ł","Ń","ń","Ņ","ņ","Ň","ň","ŉ","Ŋ",
"ŋ","Ō","ō","Ŏ","ŏ","Ő","ő","Œ","œ","Ŕ","ŕ",
"Ŗ","ŗ","Ř","ř","Ś","ś","Ŝ","ŝ","Ş","ş","Š",
"š","Ţ","ţ","Ť","ť","Ŧ","ŧ","Ũ","ũ","Ū","ū",
"Ŭ","ŭ","Ů","ů","Ű","ű","Ų","ų","Ŵ","ŵ","Ŷ",
"ŷ","Ÿ","Ź","ź","Ż","ż","Ž","ž","ſ","ƀ","Ɓ",
"Ƃ","ƃ","Ƅ","ƅ","Ɔ","Ƈ","ƈ","Ɖ","Ɗ","Ƌ","ƌ",
"ƍ","Ǝ","Ə","Ɛ","Ƒ","ƒ","Ɠ","Ɣ","ƕ","Ɩ","Ɨ",
"Ƙ","ƙ","ƚ","ƛ","Ɯ","Ɲ","ƞ","Ɵ","Ơ","ơ","Ƣ",
"ƣ","Ƥ","ƥ","Ʀ","Ƨ","ƨ","Ʃ","ƪ","ƫ","Ƭ","ƭ",
"Ʈ","Ư","ư","Ʊ","Ʋ","Ƴ","ƴ","Ƶ","ƶ","Ʒ","Ƹ",
"ƹ","ƺ","ƻ","Ƽ","ƽ","ƾ","ƿ","ǀ","ǁ","ǂ","ǃ",
"Ǆ","ǅ","ǆ","Ǉ","ǈ","ǉ","Ǌ","ǋ","ǌ","Ǎ","ǎ",
"Ǐ","ǐ","Ǒ","ǒ","Ǔ","ǔ","Ǖ","ǖ","Ǘ","ǘ","Ǚ",
"ǚ","Ǜ","ǜ","ǝ","Ǟ","ǟ","Ǡ","ǡ","Ǣ","ǣ","Ǥ",
"ǥ","Ǧ","ǧ","Ǩ","ǩ","Ǫ","ǫ","Ǭ","ǭ","Ǯ","ǯ",
"ǰ","Ǳ","ǲ","ǳ","Ǵ","ǵ","Ƕ","Ƿ","Ǹ","ǹ","Ǻ",
"ǻ","Ǽ","ǽ","Ǿ","ǿ","Ȁ","ȁ","Ȃ","ȃ","Ȅ","ȅ",
"Ȇ","ȇ","Ȉ","ȉ","Ȋ","ȋ","Ȍ","ȍ","Ȏ","ȏ","Ȑ",
"ȑ","Ȓ","ȓ","Ȕ","ȕ","Ȗ","ȗ","Ș","ș","Ț","ț",
"Ȝ","ȝ","Ȟ","ȟ","Ƞ","ȡ","Ȣ","ȣ","Ȥ","ȥ","Ȧ",
"ȧ","Ȩ","ȩ","Ȫ","ȫ","Ȭ","ȭ","Ȯ","ȯ","Ȱ","ȱ",
"Ȳ","ȳ","ȴ","ȵ","ȶ","ȷ","ȸ","ȹ","Ⱥ","Ȼ","ȼ",
"Ƚ","Ⱦ","ȿ","ɀ","Ɂ","ɂ","Ƀ","Ʉ","Ʌ","Ɇ","ɇ",
"Ɉ","ɉ","Ɋ","ɋ","Ɍ","ɍ","Ɏ","ɏ","ɐ","ɑ","ɒ",
"ɓ","ɔ","ɕ","ɖ","ɗ","ɘ","ə","ɚ","ɛ","ɜ","ɝ",
"ɞ","ɟ","ɠ","ɡ","ɢ","ɣ","ɤ","ɥ","ɦ","ɧ","ɨ",
"ɩ","ɪ","ɫ","ɬ","ɭ","ɮ","ɯ","ɰ","ɱ","ɲ","ɳ",
"ɴ","ɵ","ɶ","ɷ","ɸ","ɹ","ɺ","ɻ","ɼ","ɽ","ɾ",
"ɿ","ʀ","ʁ","ʂ","ʃ","ʄ","ʅ","ʆ","ʇ","ʈ","ʉ",
"ʊ","ʋ","ʌ","ʍ","ʎ","ʏ","ʐ","ʑ","ʒ","ʓ","ʔ",
"ʕ","ʖ","ʗ","ʘ","ʙ","ʚ","ʛ","ʜ","ʝ","ʞ","ʟ",
"ʠ","ʡ","ʢ","ʣ","ʤ","ʥ","ʦ","ʧ","ʨ","ʩ","ʪ",
"ʫ","ʬ","ʭ","ʮ","ʯ","Ͳ","ͳ","ʹ","͵","Ͷ","ͷ",
"ͺ","ͻ","ͼ","ͽ",";","Ϳ","΄","΅","Ά","·","Έ","Ή",
"Ί","Ό","Ύ","Ώ",
"ΐ","Α","Β","Γ","Δ","Ε","Ζ","Η","Θ","Ι","Κ",
"Λ","Μ","Ν","Ξ","Ο","Π","Ρ","Σ","Τ","Υ","Φ",
"Χ","Ψ","Ω","Ϊ","Ϋ","ά","έ","ή","ί","ΰ","α",
"β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ",
"ν","ξ","ο","π","ρ","ς","σ","τ","υ","φ","χ",
"ψ","ω","ϊ","ϋ","ό","ύ","ώ","Ϗ","ϐ","ϑ","ϒ",
"ϓ","ϔ","ϕ","ϖ","ϗ","Ϙ","ϙ","Ϛ","ϛ","Ϝ","ϝ",
"Ϟ","ϟ","Ϡ","ϡ","Ϣ","ϣ","Ϥ","ϥ","Ϧ","ϧ","Ϩ",
"ϩ","Ϫ","ϫ","Ϭ","ϭ","Ϯ","ϯ","ϰ","ϱ","ϲ","ϳ",
"Օ","Ֆ","🕧","🕨","🕩","🕪","🕫","🕬","🕭","🕮",
"🕯","🕰","🕱","🕲","🕳","🕴","🕵","🕶","🕷","🕸",
"🕹","🕺","🕻","🕼","🕽","🕾","🕿","🖀","🖁","🖂",
"🖃","🖄","🖅","🖆","🖇","🖈","🖉","🖊","🖋",
"🖌","🖍","🖎","🖏","🖐","🖑","🖒","🖓","🖔","🖕",
"🖖","🖗","🖘","🖙","🖚","🖛","🖜","🖝","🖞","🖟",
"🖠","🖡","🖢","🖣","🖤","🖥","🖦","🖧","🖨","🖩",
"🖪","🖫","🖬","🖭","🖮","🖯","🖰","🖱","🖲","🖳",
"🖴","🖵","🖶","🖷","🖸","🖹","🖺","🖻","🖼","🖽",
"🖾","🖿","🗀","🗁","🗂","🗃","🗄","🗅","🗆","🗇",
"🗈","🗉","🗊","🗋","🗌","🗍","🗎","🗏","🗐","🗑","🗒",
"🗓","🗔","🗕","🗖","🗗","🗘","🗙","🗚","🗛","🗜",
"🗝","🗞","🗟","🗠","🗡","🗢","🗣","🗤","🗥","🗦",
"🗧","🗨","🗩","🗪","🗫","🗬","🗭","🗮","🗯","🗰",
"🗱","🗲","🗳","🗴","🗵","🗶","🗷","🗸","🗹","🗺",
"🗻","🗼","🗽","🗾","🗿","😀"];