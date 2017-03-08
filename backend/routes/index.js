var express = require('express');
var router = express.Router();
var config = require('../config');
var mysql = require('mysql'); 
var connection = mysql.createConnection({
	host: config.host, 
	user: config.user, 
	password: config.password, 
	database: config.database
});
connection.connect();

var multer = require('multer'); 
var upload = multer({ dest: 'public/videos' });
var type = upload.single('videoToUpload');
var fs = require('fs'); 

router.post('/videos', upload.any(), function(req,res,next){
	// console.log(req)
	var name = req.files[0].originalname;
	var tempPath = req.files[0].path
	var targetPath = 'public/videos/' + name
	var size = req.files[0].size
	var insertQuery = "INSERT INTO videos (name, path, size) VALUES (?,?,?)";
	connection.query(insertQuery, [name,targetPath,size], (DBerror, results, fields)=>{
		if(DBerror) throw DBerror; 
		// res.json("uploaded succesfully"); 
		fs.readFile(tempPath, (readError, readContents)=>{
			if(readError) throw readError; 
			fs.writeFile(targetPath,readContents, (writeError)=>{
				if(writeError) throw writeError; 
				fs.unlink(tempPath, (err)=>{
					if(err) throw err
				})
			})
		})
	})
})

router.post('/transcript', function(req,res,next){
	console.log(req.body)
})

module.exports = router;
