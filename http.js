const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const types = require('./mine').types
const PORT = 1314
http.createServer(function(request, response){
    // example:  http://localhost:1900/index.html?aa=1&f=2
    // request.url:  /index.html?aa=1&f=2
    // url.parse(request.url).pathname:  /index.html
    // url.parse(request.url).search:   ?aa=1&f=2
    // url.parse(request.url).query:    aa=1&f=2
    // url.parse(request.url).path:     /index.html?aa=1&f=2
    // url.parse(request.url).href:     /index.html?aa=1&f=2

    // page loading favicon.ico  

    var pathName = url.parse(request.url).pathname
    pathName = pathName == '/' ? '/index.html' : pathName
    var realPath = decodeURI(path.join("dist", pathName)); // 路径为项目文件夹
    if(pathName == '/favicon.ico'){

    }else{
        // 判断路径是否存在
        // fs.exists 废弃的     使用 fs.stat() 或 fs.access() 代替。
        fs.stat(realPath,function(err, stats){
            if(err){
                response.writeHead(404,{
                    'Content-Type': types.txt
                })
                response.write("This request URL " + pathName + " was not found on this server.")
                response.end()
            }else{
                var type = pathName.split('.')[pathName.split('.').length-1]                
                fs.readFile(realPath,function(err, data){
                    if(err){
                        response.writeHead(500,{
                            'Content-Type': types.txt
                        })
                        response.end(err)
                    }else{
                      var headerType = types[type] || types.txt
                        response.writeHead(200,{
                            'Content-Type': headerType
                        })
                        response.write(data, 'binary')
                    }
                    response.end()
                })
            }
        })
    }
    
}).listen(PORT)
console.log("Server runing at port: " + PORT + ".");