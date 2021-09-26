const Sauce = require('../models/sauces');
const fs= require('fs');
const user = require('../models/user');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce) ;
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    sauce.save()
      .then(() => res.status(201).json({ message : 'The sauce has been added!'}))
      .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({_id: req.params.id }, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'The sauce has been updated!'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => {
            const filename = Sauce.imageUrl.split('/images/')[1]
            fs.unlink('images/${filename}', () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'The sauce has been deleted!'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));   
};

exports.likeOrDislikeSauce = (req, res, next) => {
    let likeState = req.body.like
    
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => {
            if(likeState === 1 && !Sauce.usersLiked.includes(req.body.userId)) {
                Sauce.usersLiked.push(req.body.userId)
                Sauce.likes++
                Sauce.save()  
                .then(() => res.status(200).json({ message: 'The user likes the sauce!'}))        
            }
        
            if (likeState === 0 && Sauce.usersLiked.includes(req.body.userId)) { 
                Sauce.usersLiked.pull(req.body.userId)
                Sauce.likes--
                Sauce.save()
                .then(() => res.status(200).json({ message: 'The user doesn\'t like the sauce anymore!'}))
                    
            } else if (likeState === 0 && Sauce.usersDisliked.includes(req.body.userId)) { 
                Sauce.usersDisliked.pull(req.body.userId)
                Sauce.dislikes--
                Sauce.save()
                .then(() => res.status(200).json({ message: 'The user doesn\'t dislike the sauce anymore!'}))
            }

            if(likeState === -1 && !Sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.usersDisliked.push(req.body.userId)
                Sauce.dislikes++
                Sauce.save()
                .then(() => res.status(200).json({ message: 'The user dislikes the sauce!'}))  

            }
        }) 
        .catch(error => res.status(400).json({ error }));  
};