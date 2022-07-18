
const { check, validationResult }
= require('express-validator');
module.exports ={
    createValidationFor(route) {
        switch (route) {
          case 'createUser':
            return [
              check('Amount').not().isEmpty().withMessage('Amount field required'),
              check('CustomerEmail').isEmail().withMessage('must be an email'),
              check('Currency').not().isEmpty().withMessage('Currency field required'),
              check('SplitInfo').not().isEmpty().isArray().withMessage('field required'),
            ];
          default:
            return [];
        }
      },

      checkValidationResult(req, res, next) {
        const result = validationResult(req);
        if (result.isEmpty()) {
           next();
        }else{
    
        res.status(422).json({
          errors: result.array()
        });
    }
      }
};

