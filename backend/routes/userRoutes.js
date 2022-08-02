import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';

const userRouter = express.Router();



//________________________Signup User for only that Event_________________________
userRouter.post('/signup', expressAsyncHandler(async (req, res) => {
    const { name, email, password, uniqueKey } = req.body
    const newUser = new User({
      name: name,
      email: email,
      uniqueKey: uniqueKey,
      password: bcrypt.hashSync(password),
    });
    const count = await User.countDocuments({ email })
    const counts = await User.countDocuments({ uniqueKey })

    if (count > 0 && counts > 0) {
      return res.status(402).send({
        signup_error: 'User with this email address already exists.'
      })
    }

    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      uniqueKey: user.uniqueKey,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);


//________________Get the total Number of Registers________________
//____________ just run http://localhost:5000/api/users/count in postman________
userRouter.get('/count', (req, res, next) => {
 
  User.aggregate([
    {
      $group: {
        _id: 1,
        count: {
          $sum: 1
        }
      }

    }
  ],
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data)
      }
    }
  );
})

export default userRouter;