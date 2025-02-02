const express= require("express");
const cors=require('cors');
const mysql=require('mysql2')

const app=express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'mysql.railway.internal',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'tu_contraseña',
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        return;
    }
    
    

    
});


app.get("/",(req,res)=>{
    const query = 'SELECT * FROM users';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error.message);
            return;
        }

        // Imprimir los resultados en la consola
        const users=results
        res.status(200).json(users)  //SENDING DATA TO THE FRONTEND
    })
    
    
});

app.post("/",(req,res)=>{
    // Inserción de datos directamente después de la conexión
    const query = 'INSERT INTO users (name, lastname, age, init_date, email) VALUES (?, ?, ?, ?, ?)';
    const values = [req.body.name, req.body.lastname, req.body.age, req.body.init_date, req.body.email]; // Valores a insertar

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err.message);
            db.end(); // Cerrar la conexión si hay un error
            return;
        }
            res.status(200).end()
            
    });
    
})

app.delete("/:id",(req,res)=>{
    let id=Number(req.params.id);
    const query = `DELETE FROM users where users_id=${id}`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error.message);
            return;
        }
        return;
    })
    let query2 = `SELECT * FROM users`;
    db.query(query2, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error.message);
            return;
        }
        const users=results
        res.status(200).json(users) 
        return;
    });

});

app.patch("/:id",(req,res)=>{
    const query = `
    UPDATE users 
    SET name = ?, lastname = ?, age = ?, init_date = ?, email = ?
    WHERE users_id = ?
`;
        console.log(req.params.id )
const values = [
    req.body.name,       // Valor para name
    req.body.lastname,   // Valor para lastname
    req.body.age,        // Valor para age
    req.body.init_date,  // Valor para init_date
    req.body.email,      // Valor para email
    req.params.id        // Valor para users_id (ID del usuario)
];

    
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error al modificar datos:', err.message);
                db.end(); // Cerrar la conexión si hay un error
                return;
            }
                
                res.status(200).json({
                 "message": `USUARIO EDITADO CORRECTAMENTE`
                })
                
            
})

});



app.listen(process.env.MYSQLPORT || 3306)