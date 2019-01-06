/*
 * @Author: AngelaDaddy 
 * @Date: 2018-02-03 13:18:21 
 * @Last Modified by: AngelaDaddy
 * @Last Modified time: 2018-02-03 14:05:14
 * @Description: 路由定义
  */
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Theme = require('../models/theme')
var url = require('url');

module.exports = (app, passport) => {
    var order_home,order_user,order_arch,order_cele,order_draw,order_mov,order_girl,order_natu
    var keyword
    var filter_home, filter_user, filter_arch, filter_cele, filter_draw, filter_mov, filter_girl, filter_natu

    router.get('/', function (req, res) {
        res.render('index', { user: req.user });
    })

    router.get('/home', function (req, res) {       
        //Model.find(condition, fields, { sort: [['_id', -1]] }, callback);
        //Model.find().sort({ '_id': -1 }).limit(1).exec(function (err, docs) { })
        var params = url.parse(req.url, true).query;
        keyword = params.s
        if (keyword == null) {
            filter_home = {}
        } else filter_home = {
            name: eval("/" + keyword + "/i")
            //name: { $regex: title, $Option: "$i" }   
        }
        var x = params.orderby;
        switch (x) {
            case 'price': order_home = { 'price': 1 };
                break;
            case 'price-desc': order_home = { 'price': -1 };
                break;
            case '_id': order_home = { '_id': 1 };
                break;
            case '_id_desc': order_home = { '_id': -1 };
                break;
            case 'name': order_home = { 'name': 1 };
                break;
            default: order_home = { '_id': 1 };
        }
        Theme.find(filter_home).sort(order_home).exec(function (err, allThemes) {
            if (err) {
                console.log(err);
            } else {
                res.render('home', { user: req.user, wallpapers: allThemes });
            }
        }); 
    })

    router.get('/user/:username', function (req, res) {
        var params = url.parse(req.url, true).query;
        keyword = params.s;
        var x = params.orderby;
        if (keyword == null) {
            filter_user = { username: req.params.username };
        } else filter_user = {
             name: eval("/" + keyword + "/i") , username: req.params.username
                //name: { $regex: title, $Option: "$i" }  
        }
        switch (x) {
            case 'price': order_user = { 'price': 1 };
                break;
            case 'price-desc': order_user = { 'price': -1 };
                break;
            case '_id': order_user = { '_id': 1 };
                break;
            case '_id_desc': order_user = { '_id': -1 };
                break;
            case 'name': order_user = { 'name': 1 };
                break;
            default: order_user = { '_id': 1 };
        }
        Theme.find(filter_user).sort(order_user).exec(function (err, classThemes) {
            if (err) {
                console.log(err);
                res.redirect('home')
            } else {
                res.render('user', { user: req.user, wallpapers: classThemes });
            }
        })
    })

    router.get('/signup', function (req, res) {
        res.render('signup', {})
    })

    router.post('/signup', function (req, res) {
        User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function (err, user) {
            if (err) {
                return res.render('signup', { user: user })
            }
            passport.authenticate('local')(req, res, function () { 
                req.flash('注册成功！')
                res.redirect('/home')
            })
        })
    })

    router.get('/signin', function (req, res) {
        res.render('signin', { user: req.user })
    })

    router.post('/signin', passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/signin',
    }))

    router.get('/logout', function (req, res) {
        req.logout()
        req.flash('成功退出！')
        res.redirect('/home')
    });

    /* GET newtheme page. */
    router.get('/newtheme', function (req, res) {
        res.render('newtheme', { user: req.user });
    });
    /* POST newtheme logic. */
    router.post('/newtheme', function (req, res) {
        var name = req.body.name;
        var image = req.body.image;
        var username = req.user.username;
        var price = req.body.price;
        var classification = req.body.classification;
        var description = req.body.description;
        var newpic = { name: name, image: image, username: username, price: price, classification: classification, description: description };
        Theme.create({
            name: newpic.name,
            image: newpic.image,
            username: newpic.username,
            price: newpic.price,
            classification: newpic.classification,
            description: description
        }, function (err) {
            if (err) {
                console.log(err);
                res.render('newtheme');
            } else {
                res.redirect('home');
            }
        });
    });

    router.get('/official-themes', function (req, res) {
        res.render('official-themes', { user: req.user });
    });

    /* GET product page. */
    router.get('/product/:id', function (req, res) {
        Theme.findById(req.params.id, function (err, foundTheme) {
            if (err) {
                console.log(err);
            } else {
                res.render('product', { user: req.user, wallpaper: foundTheme });
            }
        });
    });

    router.get('/product/:id/edit', function (req, res) {
        Theme.findById(req.params.id, function (err, foundTheme) {
            if (err) {
                console.log(err);
            } else {
                res.render('edit', { user: req.user, wallpaper: foundTheme });
            }
        });
    });

    router.put('/product/:id', function (req, res) {
        var name = req.body.name;
        var image = req.body.image;
        var username = req.user.username;
        var price = req.body.price;
        var classification = req.body.classification;
        var description = req.body.description;
        var newpic = { name: name, image: image, username: username, price: price, classification: classification, description: description };
        Theme.findByIdAndUpdate(req.params.id, {
            name: newpic.name,
            image: newpic.image,
            username: newpic.username,
            price: newpic.price,
            classification: newpic.classification,
            description: description
        }, function (err, updated) {
            if (err) {
                console.log(err);
                res.redirect('/home')
            } else {
                res.redirect('/product/'+req.params.id);
            }
        });
    });

    router.delete('/product/:id', function (req, res) {
        Theme.findByIdAndDelete(req.params.id, function (err) {
            if (err) {
                res.redirect('/home')
            } else {
                res.redirect('/home');
            }
        });
    });

    router.get('/sell', function (req, res) {
        res.render('sell', { user: req.user });
    });

    router.get('/architecture', function (req, res) {
        var params = url.parse(req.url, true).query;
        keyword = params.s
        if (keyword == null) {
            filter_arch = { classification: 'architecture' }
        } else filter_arch = {
            name: eval("/" + keyword + "/i"), classification: 'architecture'
            //name: { $regex: title, $Option: "$i" }   
        }
        var x = params.orderby;
        switch (x) {
            case 'price': order_arch = { 'price': 1 };
                break;
            case 'price-desc': order_arch = { 'price': -1 };
                break;
            case '_id': order_arch = { '_id': 1 };
                break;
            case '_id_desc': order_arch = { '_id': -1 };
                break;
            case 'name': order_arch = { 'name': 1 };
                break;
            default: order_arch = { '_id': 1 };
        }
        Theme.find(filter_arch).sort(order_arch).exec(function (err, classThemes) {
            if (err) {
                console.log(err);
                res.redirect('home')
            } else {
                res.render('architecture', { user: req.user, wallpapers: classThemes });
            }
        });
    })

    router.get('/celebrities', function (req, res) {
        var params = url.parse(req.url, true).query;
        keyword = params.s
        if (keyword == null) {
            filter_cele = { classification: 'celebrities' }
        } else filter_cele = {
            name: eval("/" + keyword + "/i"), classification: 'celebrities'
            //name: { $regex: title, $Option: "$i" }   
        }
        var x = params.orderby;
        switch (x) {
            case 'price': order_cele = { 'price': 1 };
                break;
            case 'price-desc': order_cele = { 'price': -1 };
                break;
            case '_id': order_cele = { '_id': 1 };
                break;
            case '_id_desc': order_cele = { '_id': -1 };
                break;
            case 'name': order_cele = { 'name': 1 };
                break;
            default: order_cele = { '_id': 1 };
        }
        Theme.find(filter_cele).sort(order_cele).exec(function (err, classThemes) {
            if (err) {
                console.log(err);
                res.redirect('home')
            } else {
                res.render('celebrities', { user: req.user, wallpapers: classThemes });
            }
        });
    })

    router.get('/drawing-art', function (req, res) {
        var params = url.parse(req.url, true).query;
        keyword = params.s
        if (keyword == null) {
            filter_draw = { classification: 'drawing-art' }
        } else filter_draw = {
            name: eval("/" + keyword + "/i"), classification: 'drawing-art'
            //name: { $regex: title, $Option: "$i" }   
        }
        var x = params.orderby;

        switch (x) {
            case 'price': order_draw = { 'price': 1 };
                break;
            case 'price-desc': order_draw = { 'price': -1 };
                break;
            case '_id': order_draw = { '_id': 1 };
                break;
            case '_id_desc': order_draw = { '_id': -1 };
                break;
            case 'name': order_draw = { 'name': 1 };
                break;
            default: order_draw = { '_id': 1 };
        }
        Theme.find(filter_draw).sort(order_draw).exec(function (err, classThemes) {
            if (err) {
                console.log(err);
                res.redirect('home')
            } else {
                res.render('drawing-art', { user: req.user, wallpapers: classThemes });
            }
        }); 
    })

    router.get('/movies', function (req, res) {
        var params = url.parse(req.url, true).query;
        keyword = params.s
        if (keyword == null) {
            filter_mov = { classification: 'movies' }
        } else filter_mov = {
            name: eval("/" + keyword + "/i"), classification: 'movies'
            //name: { $regex: title, $Option: "$i" }   
        }
        var x = params.orderby;

        switch (x) {
            case 'price': order_lan = { 'price': 1 };
                break;
            case 'price-desc': order_mov = { 'price': -1 };
                break;
            case '_id': order_mov = { '_id': 1 };
                break;
            case '_id_desc': order_mov = { '_id': -1 };
                break;
            case 'name': order_mov = { 'name': 1 };
                break;
            default: order_mov = { '_id': 1 };
        }
        Theme.find(filter_mov).sort(order_mov).exec(function (err, classThemes) {
            if (err) {
                console.log(err);
                res.redirect('home')
            } else {
                res.render('movies', { user: req.user, wallpapers: classThemes });
            }
        }); 
    })

    router.get('/girls', function (req, res) {
        var params = url.parse(req.url, true).query;
        keyword = params.s
        if (keyword == null) {
            filter_girl = { classification: 'girls' }
        } else filter_girl = {
            name: eval("/" + keyword + "/i"), classification: 'girls'
            //name: { $regex: title, $Option: "$i" }   
        }
        var x = params.orderby;

        switch (x) {
            case 'price': order_girl = { 'price': 1 };
                break;
            case 'price-desc': order_girl = { 'price': -1 };
                break;
            case '_id': order_girl = { '_id': 1 };
                break;
            case '_id_desc': order_girl = { '_id': -1 };
                break;
            case 'name': order_girl = { 'name': 1 };
                break;
            default: order_girl = { '_id': 1 };
        }
        Theme.find(filter_girl).sort(order_girl).exec(function (err, classThemes) {
            if (err) {
                console.log(err);
                res.redirect('home')
            } else {
                res.render('girls', { user: req.user, wallpapers: classThemes });
            }
        }); 
    })

    router.get('/nature', function (req, res) {
        var params = url.parse(req.url, true).query;
        keyword = params.s
        if (keyword == null) {
            filter_natu = { classification: 'nature' }
        } else filter_natu = {
            name: eval("/" + keyword + "/i"), classification: 'nature'
            //name: { $regex: title, $Option: "$i" }   
        }
        var x = params.orderby;

        switch (x) {
            case 'price': order_natu = { 'price': 1 };
                break;
            case 'price-desc': order_natu = { 'price': -1 };
                break;
            case '_id': order_natu = { '_id': 1 };
                break;
            case '_id_desc': order_natu = { '_id': -1 };
                break;
            case 'name': order_natu = { 'name': 1 };
                break;
            default: order_natu = { '_id': 1 };
        }
        Theme.find(filter_natu).sort(order_natu).exec(function (err, classThemes) {
            if (err) {
                console.log(err);
                res.redirect('home')
            } else {
                res.render('nature', { user: req.user, wallpapers: classThemes });
            }
        });
    })
    app.use('/', router)
}
