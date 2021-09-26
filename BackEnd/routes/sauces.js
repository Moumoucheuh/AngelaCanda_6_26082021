const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Ajouter une sauce -> CREATE
router.post('/', auth, multer, saucesCtrl.createSauce);
  
// Récupérer une seule sauce pour affichage FrontEnd -> READ
router.get('/:id', auth, saucesCtrl.getOneSauce);
  
// Récupérer toutes les sauces enregistrées dans la BDD pour affichage FrontEnd -> READ
router.get('/', auth, saucesCtrl.getAllSauces);
  
// Modifier une sauce -> UPDATE
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
  
// Supprimer une sauce -> DELETE
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// Gérer les like/dislike
router.post('/:id/like', auth, saucesCtrl.likeOrDislikeSauce);

module.exports = router;
