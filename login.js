const mysql = require('mysql')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const hbs = require('hbs')
const bcrypt = require('bcrypt')
const PORT = process.env.PORT 

const app = express()
app.listen(PORT, () => {
    console.log("running")
})
var connection = mysql.createPool({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user:  'ba164689340852',
    password: '4d1a4f8a', 
    database: 'heroku_3060365da640b76'
})

function getUserType(string) {
    var role = ''

    if(string == 'admin') {
        role = 'admin'
    }
    
    return role
}

app.set('view engine', 'hbs')
app.use(express.static('public'))
app.set('views', path.join(__dirname, '/templates/views'))
hbs.registerPartials(path.join(__dirname, '/templates/partials'))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false
}))
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.get('/', function(req,res) {
    res.render('login')
})

app.post('/auth', function(req,res) {
    var username = req.body.username
    var password = req.body.password

    if(username && password) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], function(error, data, fields) {
            if (data.length > 0) {
                hash = data[0].password
                bcrypt.compare(password, hash, function(err, correct) {
                    if(correct) {                
                        req.session.loggedin = true
                        req.session.username = username
                        req.session.role = data[0].role
                        res.redirect('/viewcourse')
                    } else {
                        res.render('login', {
                            error: 'Invalid Credentials'
                        })
                    }
                })
        }  
        
            else {
                res.render('login', {
                    error: 'User does not exist'
                    })
                }
            })
    }    
})

app.get('/home', function(req,res) {    

    if(req.session.loggedin) {
        res.render('home', {
            user  : req.session.username,
            admin : getUserType(req.session.role),
        }) 
    } else {
        res.redirect('/')
    }
})
app.get('/createcourse', function(req,res) {
    if(req.session.loggedin) {
        res.render('createcourse', {
            admin : getUserType(req.session.role)
        }) 
    } else {
        res.redirect('/')
    }
})

app.get('/logout', function(req,res) {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err)
        }
        res.redirect('/')
    })
})

app.post('/applogin', function(req,res) {
    var username = req.body.username
    var password = req.body.password

    if(username && password) {

        connection.query('SELECT * FROM users WHERE username = ?', [username], function(error, data, fields) {
            if(error) console.log(error)
            
            if (data.length > 0) {
                // res.send(data)
                let hash = data[0].password
                // res.send(hash)
                bcrypt.compare(password, hash, function(err, correct) {
                    if(correct) {                
                        // req.session.loggedin = true
                        // req.session.username = username
                        // req.session.role = data[0].role
                        // res.redirect('/home')
                        console.log(data[0])
                        res.end(JSON.stringify(data[0]))
                    } else {
                        res.end("Wrong")
                    }
                })
            }  
            
            else {
                res.render('login', {
                    error: 'User does not exist'
                    })
                }
            })
        }    
})


app.post('/course', (req,res) => {
    form = req.body
    console.log(form)
    console.log(form.firstName.length)
    let username = req.session.username

    if(form.name && form.section && username != null) {
        connection.query('INSERT INTO coursetemp(course_name, course_number, instructor) VALUES (?,?,?)',
        [form.name, form.section, username], function(error, results, fields) {
            if(error) console.log('error')
            else {
                console.log('classes added')
                res.redirect('/createcourse')
            }
        })
    }

    if(form.firstName && form.lastName && form.id) {
        for (let i = 0; i < form.firstName.length; i++) {
            connection.query('INSERT INTO students(first_name, last_name, student_id, course_number) VALUES (?,?,?,?)'
            [form.firstName[i], form.lastName[i], form.id[i], form.section], function (error, results, fields) {
                if(error) console.log(error)
                else {
                    res.redirect('/createcourse')
                }
            })
        }
    }

    // for(let i=0; i<form.firstName.length; i++) {
    //     insert:
    //         form.name,
    //         form.section,
    //         form.firstname[i]
    // }

    // res.end()
})

app.get('/adminadd', (req,res) => {
    if(req.session.loggedin && req.session.role == 'admin') {
        res.render('adminadd', {
            admin : getUserType(req.session.role)
        }) 
    } else if(req.session.loggedin && req.session.role != 'admin') {
        res.render('home')
    } else {
        res.redirect('/')
    }
})

app.post('/adminadd', (req,res) => {
    form = req.body
    console.log(form.firstName)

    if(form.firstName && form.lastName && form.schoolID && form.role) {
        connection.query('INSERT ')
    }

})

app.get('/studentadd', (req,res) => {
    if(req.session.loggedin && req.session.role == 'admin') {
        res.render('studentadd', {
            admin : getUserType(req.session.role)
        }) 
    } else if(req.session.loggedin && req.session.role != 'admin') {
        res.render('home')
    } else {
        res.redirect('/')
    }
})

app.post('/studentadd', (req,res) => {
    form = req.body

    if(form.first && form.last && form.username) {
        connection.query('INSERT INTO student(first_name, last_name, username) VALUES (?,?,?)', 
        [form.first, form.last, form.username], function(error, results, fields) {
            if(error) { 
                console.log(error) 
                res.render('studentadd', {
                    error: 'Error entering student',
                    admin : getUserType(req.session.role)

                })
            }
            else {
                res.render('studentadd', {
                    message: 'Student successfully added',
                    admin: getUserType(req.session.role)
                })
            }
        })

    }

})

app.get('/viewcourse', (req,res) => {
    let username = req.session.username
    connection.query('SELECT * FROM coursetemp WHERE instructor = ?', [username], (error, results, fields) => {
        if(error) {
            console.log(error)
            res.render('/home')
        } 
        else {
            res.render('viewcourse', {
                courses : results,
                admin: getUserType(req.session.role)
            })
        }
    })
})

app.post('/viewcourse', (req,res) => {
    let course = req.body.course
    console.log(req.body)


    if(req.body.studentid) {
        connection.query('DELETE FROM students WHERE student_id = ?', [req.body.studentid], (err, res, fields) => {
            if(err) console.log(err)
        })
    }

    
    if(req.body.first && req.body.last && req.body.id && req.body.course) {
        console.log('inside')
        connection.query('INSERT INTO students(first_name, last_name, student_id, course_number) VALUES (?,?,?,?)', 
        [req.body.first, req.body.last, req.body.id, req.body.course], (err, res, fields) => {
            if(err) console.log(err)
        })
    }

    connection.query('SELECT * FROM coursetemp WHERE instructor = ?', [req.session.username], (error, results2, fields) => {
        if(error) console.log(error)
        else {
            connection.query('SELECT * FROM students WHERE course_number = ?', [course], (error, results, fields) => {
                if(error) console.log(error)     
                
                res.render('viewcourse', {
                courses : results2, 
                students: results,
                admin: getUserType(req.session.role)
            })

            })
        }
    })
    


})

app.get('/courses', (req,res) => {
    connection.query('SELECT * from coursetemp', (err, data, fields) => {
        console.log(data)
        if(err) console.log(err)
        if(data) {
            res.end(JSON.stringify(data))            
        }
    })

})

// app.listen(PORT, () => {
//     console.log("running")
// })
// app.listen(3000)
