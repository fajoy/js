#!/usr/bin/env node
console.log("var argv=");
console.log(process.argv);
console.log("");

function dump(){
    var args=arguments;

    console.log("var callee=");
    console.log(arguments.callee);
    console.log("var caller=");
    console.log(arguments.callee.caller);

    console.log("var arguments=");
    console.log(JSON.stringify(args,null,4));

    var index=Object.keys(args);
    console.log("var index=");
    console.log(index);
}


console.log(">>> dump(process.argv);");
dump(process.argv);

console.log("");
console.log(">>> dump.call(null,process.argv);");
dump.call(null,process.argv);

console.log("");
console.log(">>> dump.apply(null,process.argv);");
dump.apply(null,process.argv);


console.log("");
console.log('>>> fixdump("world")');
var fixdump=dump.bind(null,"hello",process.argv);
fixdump("world");


console.log("");
console.log(">>> helloworld();");
function helloworld(){
    dump("hello","world");
}
helloworld();
