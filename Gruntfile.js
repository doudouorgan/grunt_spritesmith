'use strict';
var fs = require('fs');
var mapData=[];
var fileData = {'type':'','data': [], 'total': 0};

module.exports = function (grunt) {
    grunt.initConfig({
        sprite: {
            icIcons: {
                src      : ['./putImages/*.png'], //素材图片
                dest     : './outImages/icons.png', // 默认雪碧图输出路径
                destCss  : './outImages/icons.css', // 雪碧图less输出路径，也支持输出css
                imgPath  : './icons.png', // 默认雪碧图在css中url引用路径
                padding  : 5,
                cssVarMap: function (sprite) {
                    var spriteNameLength = sprite.name.length;
                    var lastIndex = sprite.name.lastIndexOf('_');
                    var firstIndex = sprite.name.indexOf('_');
                    var spriteInfo = {
                        'No'  : sprite.name.substring(lastIndex + 1, spriteNameLength),
                        'type': sprite.name.substring(firstIndex + 1, lastIndex)
                    };

                    fileData.type = sprite.name.substring(0, firstIndex);
                    mapData.push(spriteInfo);

                    sprite.name = fileData.type+' .' + sprite.name;
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-spritesmith');
    // 写入json文件
    grunt.registerTask('writeJson', 'writeIn jsonfile', function () {
        fileData.data = mapData;// 将传来的对象push进数组对象中
        fileData.total = fileData.data.length;// 定义一下总条数，为以后的分页打基础

        var str = JSON.stringify(fileData);// 因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        fs.writeFileSync('./outImages/icons.json', str, function (err) {
            if (err) {
                console.error(err);
            }
        });
    });


    grunt.registerTask('build', function (target) {
        grunt.task.run([
            'sprite',
            'writeJson'
        ]);
    });
};

