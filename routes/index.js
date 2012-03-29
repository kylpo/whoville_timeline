
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log( 'index requested' );
  res.render('index.jade', { title: 'Express' });
};
