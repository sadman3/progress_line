var fs = require('fs');

var baseProgressLinePath = '../data/progress_line/'
var baseTaskTreePath = '../data/task_tree/'


function readProgressLine(fileName) {
    var filepath = baseProgressLinePath + fileName;

    const data = fs.readFileSync(filepath,
            {encoding:'utf8', flag:'r'});
    
    
    return JSON.parse(data);
}


function writeProgressLine(fileName, fileData) {
    var filepath = baseProgressLinePath + fileName;
    var content = JSON.stringify(fileData, null, 4);

    fs.writeFile(filepath, content, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
      
}

function readTaskTree(fileName) {
    var filepath = baseTaskTreePath + fileName;

    const data = fs.readFileSync(filepath,
            {encoding:'utf8', flag:'r'});
    
    return data;
}


function writeTaskTree(fileName, fileData) {
    var filepath = baseTaskTreePath + fileName;

    var task_tree = ""
    for (var i = 0; i < fileData.length; i++) {
        task_tree += fileData[i]
        if (i < fileData.length - 1) {
            task_tree += "\n";
        }
    }
    fs.writeFile(filepath, task_tree, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });      
}


module.exports = {
    readProgressLine, writeProgressLine, readTaskTree, writeTaskTree
}