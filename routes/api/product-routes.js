const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData =  await Product.findAll({
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [
      {
        model: Category
      },      
      {
        model: Tag, through: ProductTag, as: 'products_tags'
      }
    ]
    })
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req,res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData =  await Product.findByPk(req.params.id, {
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [
        {
          model: Category
        },      
        {
          model: Tag, through: ProductTag, as: 'products_tags'
        }
      ]
      })
    if(!productData){
      res.status(400).json({ message: 'No product found with thid id' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req,res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    try {
      const productData =  await Product.create(req.body);
      // insert into producttag
      const productId= productData.id;
      if (req.body.tagIds.length) {
        const productTags = req.body.tagIds.map((tagId) => {
          return {
            product_id: productId,
            tag_id: tagId
          }
        })
         ProductTag.bulkCreate(productTags);         
      }
      res.status(200).json(productData);
    } catch (err) {
      res.status(400).json(err);
    }
});

// update product
router.put('/:id', async (req,res) => {
  // update product data
  try {
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if(!productData){
      res.status(400).json({ message: 'No Product found with thid id' });
      return;
    }
    res.status(200).json(productData);  
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req,res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      }
    });
    if(!productData){
      res.status(400).json({ message: 'No product found with thid id' });
      return;
    }
    res.status(200).json(productData);  
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
