// Creación de la Conexión
var mongoose        = require('mongoose')
  , db_lnk          = 'mongodb://localhost/judcdb'
  , db              = mongoose.createConnection(db_lnk)

var usuario_schema = mongoose.Schema({
  nombre        :   String,
  password   :   String,
  dato: String
   
})

var inscrito_schema = mongoose.Schema({
  //autores
  n_1        :   String,
  n_2        :   String,
  n_3        :   String,

 docentes  : [usuario_schema],
 
  //fecha de inscripcion
  n2   :   String,
  //tema de investigacion
  n3 : String,
    //linea de investigacion
  n4 : String,
    //tutor del trabajo
  n5 : String,
    //asesor del  trabajo
  n6 : String,
    //Departamento
  n7 : String,
    //Carrera
  n8 : String,
    //Area de estudio
  n9 : String,
    //Tipos de trabajo
  n10 : String,
    //ruta de archivo informe
  n11 : String,

  evaluar:{
            j1:String,
            j2:String,
            j3:String,
            nota1:String,
            nota2:String,
            nota3:String,
            promedio:String
          }
  
  
})
// Creación de variables para cargar el modelo
var Usuario = db.model('Usuario', usuario_schema)
var Inscrito = db.model('Inscrito', inscrito_schema)


/**
 * @param   {Object}  req
 * @param   {Object}  res
 * @param   {Object}  next
 *
 * @api     public
 *
 * @url     GET       /
 */
 //FUNCION PARA VALIDAR LA INSERCION DE USUARIO
//FUNCION PARA VALIDAR LA INSERCION DE USUARIO
// exports.login=function(req, res, next){
//   if(req.session.user){
//     next();

//   }else{
//     res.redirect('/login');
//   }
// }
exports.pizarra = function (req, res) {
     Inscrito.find({"$or": [{"evaluar.j1": req.session.user}, {"evaluar.j2": req.session.user},{"evaluar.j3": req.session.user}]})
      //.where('evaluar.j1').equals('Marcos')
      .exec(obtenerdatos);
      function obtenerdatos (err, usuarios){
        if (err){
          console.log(err);
        }
          return res.render('pizarra', {usuarios:usuarios})
      }
      
  
}

exports.index = function (req, res) {

      res.render('index')
  
}





exports.admin = function (req, res, next) {

  Usuario.find(Irusuario)

  // NOTA: Creo que es bueno usar verbos en inglés para las funciones,
  //       por lo cómodo que son en estos casos (get, got; find, found)
  function Irusuario (err, usuarios) {
    if (err) {
      console.log(err)
      return next()
    }

    return res.render('admin', {title: 'Lista de Usuarios', usuarios: usuarios})
  }
}


//FUNCION PARA AUTENTICAR LA SESSION
exports.autenticar=function(req, res){
    Usuario.find({dato:req.body.txtUsuario, password:req.body.txtClave}, function (err, user) {
      if(user.length > 0){
        req.session.user = req.body.txtUsuario;
        
        //res.redirect('/admin');
        //Inscrito.find();
        //res.render('pizarra', {usuarios:user})
        obtenerdatos();
        
      }else{
        res.send('El usuario no existe o sus datos son incorrectos.');
      }
      function obtenerdatos (err, usuarios){
       //var dato=req.session.user;
       //var dato="Jose";
       //Inscrito.find({'evaluar.j1':req.body.txtUsuario,'evaluar.j2':req.body.txtUsuario})
       Inscrito.find({"$or": [{"evaluar.j1": req.body.txtUsuario}, {"evaluar.j2": req.body.txtUsuario},{"evaluar.j3": req.body.txtUsuario}]
})
      //.where('evaluar.j2').equals(req.session.user)
      .exec(obtenerdatos);
      function obtenerdatos (err, usuarios){
        if (err){
          console.log(err);
        }
          return res.render('pizarra', {usuarios:usuarios})
      }
      
    }

      if(req.body.txtUsuario=='jose' && req.body.txtClave=='1234'){
        req.session.user = req.body.txtUsuario;
        res.redirect('/admin');
      }
      

      
    
    });
  }





/**
 * @param   {Object}  req
 * @param   {Object}  res
 * @param   {Object}  next
 *
 * @api     public
 *
 * @url     GET       /usuario/:id
 */
exports.show_edit = function (req, res, next) {

  // Obtención del parámetro id desde la url
  var id = req.params.id

  Usuario.findById(id, Irusuario)

  function Irusuario (err, usuarios) {
    if (err) {
      console.log(err)
      return next(err)
    }

    return res.render('show_edit', {title: 'Ver Usuario', usuarios: usuarios})

  }
}

/**
 * @param   {Object}  req
 * @param   {Object}  res
 * @param   {Object}  next
 *
 * @api     public
 *
 * @url     POST      /usuario/:id
 */
exports.update = function (req, res, next) {
  var id = req.params.id

  var nombre      = req.body.nombre       || ''
  var password = req.body.password  || ''
  var dato = req.body.dato  || ''
  
  // Validemos que nombre o descripcion no vengan vacíos
  if ((nombre=== '') || (password === '')) {
    console.log('ERROR: Campos vacios')
    return res.send('Hay campos vacíos, revisar')
  }



  Usuario.findById(id, Irusuario)

  function Irusuario (err, usuario) {
    if (err) {
      console.log(err)
      return next(err)
    }

    if (!usuario) {
      console.log('ERROR: ID no existe')
      return res.send('ID Inválida!')
    } else {
      usuario.nombre       = nombre
      usuario.password  = password
      usuario.dato  = dato


      usuario.save(onSaved)
    }
  }

  function onSaved (err) {
    if (err) {
      console.log(err)
      return next(err)
    }

    return res.redirect('/admin')
  }
}

/**
 * @param   {Object}  req
 * @param   {Object}  res
 * @param   {Object}  next
 *
 * @api     public
 *
 * @url     GET       /delete-usuario/:id
 */
exports.remove = function (req, res, next) {
  var id = req.params.id

  Usuario.findById(id, Irusuario)

  function Irusuario (err, usuario) {
    if (err) {
      console.log(err)
      return next(err)
    }

    if (!usuario) {
      return res.send('Invalid ID. (De algún otro lado la sacaste tú...)')
    }

    // Tenemos el usuario, eliminemoslo
    usuario.remove(onRemoved)
  }

  function onRemoved (err) {
    if (err) {
      console.log(err)
      return next(err)
    }

    return res.redirect('/admin')
    return res.redirect('/inscritos')
  }
}



/**
 * @param   {Object}  req
 * @param   {Object}  res
 * @param   {Object}  next
 *
 * @api     public
 *
 * @url     GET       /nuevo-usuario
 */
exports.create = function (req, res, next) {
  if (req.method === 'GET') {
    return res.render('show_edit', {title: 'Nuevo Usuario', usuarios: {}})
  } else if (req.method === 'POST') {
    // Obtenemos las variables y las validamos
    var nombre      = req.body.nombre       || ''
    var password    =    req.body.password  || ''
    var dato    =    req.body.dato  || ''
    

    // Validemos que nombre o descripcion no vengan vacíos
    if ((nombre=== '') || (password === '')) {
      console.log('ERROR: Campos vacios')
      return res.send('Hay campos vacíos, revisar')
    }

        // Creamos el documento y lo guardamos
    var usuario = new Usuario({
        nombre        : nombre
      , password   : password
      , dato   : dato
    })

    usuario.save(onSaved)

    function onSaved (err) {
      if (err) {
        console.log(err)
        return next(err)
      }

      return res.redirect('/admin')
    }
  }  
}







