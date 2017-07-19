/**
 * Created by 黄森 on 2017/6/15.
 */
// 首页
var file= require('../models/file.js');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var sd = require('silly-datetime');

exports.showIndex = function (req,res,next) {
    file.getAllAlbums(function (err,allAlbums) {
        if(err){
            next();    //交给下面的中间件
            return;
        }
        res.render("index",{
          "albums":allAlbums
        })
    })
};
// 相册页面
exports.showAlbum = function (req,res,next) {
    //便利图片
    var albumName = req.params.albumName;
    file.getAllImagesByAlbumName(albumName,function (err,imagesArray) {
        if(err){
            next();
            return;
        }
        res.render('album',{
            "albumname" : albumName,
            "images" :imagesArray
        })
    });
};


// 上传页面

exports.showUp = function (req,res) {
    file.getAllAlbums(function (err,albums) {
        res.render("up",{
            "albums":albums
        })
    });

};


// 上传表单
exports.dopost=function (req,res) {
    var form = new formidable.IncomingForm();

    form.uploadDir = path.normalize(__dirname + "/../tempup/");

    form.parse(req, function(err, fields, files,next) {
        console.log(fields);
        console.log(files);
        //改名
        if(err){
            next();     //这个中间件不受理这个请求了，往下走
            return;
        }
        //判断文件尺寸
        var size = parseInt(files.tupian.size);
        if(size > 2000000){
            res.send("图片尺寸应该小于1M");
            //删除图片
            fs.unlink(files.tupian.path);
            return;
        }

        var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
        var ran = parseInt(Math.random() * 89999 + 10000);
        var extname = path.extname(files.tupian.name);

        var wenjianjia = fields.wenjianjia;
        var oldpath = files.tupian.path ;
        var newpath = path.normalize(__dirname + "/../uploads/" + wenjianjia + "/" + ttt + ran + extname);
        fs.rename(oldpath,newpath,function(err){
            if(err){
                res.send("改名失败");
                return;
            }
            res.send("成功");
        });
    });
    return;
};