var express = require('express');
var router = express.Router();
var repos = require('./repos.js');

var title = 'HawkPR application'; 
var header='User Repository vs Pull Request Counts';


router.get(':userid/repos',  async (req, res, next) =>{
    try{
      console.log('calling either prev or next');
      //var userrepodata =  await repos.getPage(req.params.userid);
      
      res.render("layout", {
        title: title,
        header: header,
        userrepodata:'userrepodata'
      });
    }catch (err){
      process.stdout.write(err);
      next(err);
    }  
  });

  module.exports = router;
