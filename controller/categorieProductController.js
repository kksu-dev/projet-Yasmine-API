const { CategorieProduit } = require('../models');

const getAllCategorieProduit = async (req, res) => {
  try {
    
    const categorieProduitAll = await CategorieProduit.findAll();
    res.status(200).json({ status:true, data: categorieProduitAll });
  } catch (error) {
    console.error('Erreur lors de la récupération de la ville :', error);
    res.status(500).json({ status:false, message: 'Une erreur est survenue lors de la récupération de la ville:', error });
  }
};

//Enregistrer une categorie de produit

const registerCategorieProduct = async (req, res) => {
    try {
       
      const { libelle} = req.body;
      const existingCategorieProduit = await CategorieProduit.findOne({ where: { libelle } });
      if (existingCategorieProduit) {
         return res.status(200).json({ status:false,message: 'La categorie produit existe deja'});
      }
      const newCategorieProduct = await CategorieProduit.create({
          libelle,        
      });
      return res.status(201).json({ status:true, data: newCategorieProduct });
    } catch (error) {
      return res.status(500).json({ status:false,message: 'Une erreur est survenue lors de l\'enregistrement.',error });
    }
};

// const deleteCategorieProduct = async (req, res) => {
//     try {
//         const { categorieProduitId } = req.body;
//         CategorieProduit.destroy({
//             where:{
//                 categorieProduitId:categorieProduitId
//             }
//         })
//         return res.status(201).json({ status:true, message: 'La categorie produit à été supprimé.' });
//     } catch (error) {
//       return res.status(500).json({ status:false,message: 'Une erreur est survenue lors de l\'enregistrement.',error });
//     }
// };

const deleteCategorieProduct = async (req, res) => {
    try {
        const { CategorieProduitIds } = req.body; // Supposons que utilisateurIds est un tableau d'identifiants d'utilisateurs à supprimer.
    
        const result = await CategorieProduit.destroy({
          where: {
            categorieProduitId: CategorieProduitIds,
          },
        });
    
        if (result > 0) {
          return res.status(200).json({ status: true, message: 'Les categories produits ont été supprimés avec succès.' });
        } else {
          return res.status(404).json({ status: false, message: 'Aucune categorie n\'a été trouvé pour la suppression.' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Une erreur est survenue lors de la suppression des categories produits.', error });
      }
};

const updateCategorieProduct = async (req,res)=>{
    try {
        const { categorieProduitId, libelle } = req.body; // Les nouvelles données de la catégorie
    
        const [updatedRowsCategorieProduct] = await CategorieProduit.update(
          { libelle },
          { where: { categorieProduitId } }
        );
    
        if (updatedRowsCategorieProduct > 0) {
          return res.status(200).json({ status: true, message: 'La catégorie a été mise à jour avec succès.' });
        } else {
          return res.status(404).json({ status: false, message: 'Aucune catégorie n\'a été trouvée pour la mise à jour.' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Une erreur est survenue lors de la mise à jour de la catégorie.', error });
      }
}


module.exports = {
    getAllCategorieProduit,
    registerCategorieProduct,
    deleteCategorieProduct,
    updateCategorieProduct
};
