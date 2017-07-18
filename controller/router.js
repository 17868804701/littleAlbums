/**
 * Created by 黄森 on 2017/6/15.
 */
// 首页
var file= require('../models/file.js');
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