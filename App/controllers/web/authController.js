const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { userModal } = require('../../model/userModel');
const saltRounds = 10;
let jwt = require('jsonwebtoken');
const { transporter } = require('../../config/helper');

let register = async (req, res) => {

    let reqobj = { ...req.body }

    const hash = bcrypt.hashSync(req.body.password, saltRounds)

    reqobj['password'] = hash

    try {
        let user = new userModal(reqobj)

        let userRes = await user.save();

        let token = jwt.sign({ id: userRes._id }, process.env.TOKENKEY)

        res.send({
            _status: true,
            _message: "Registerred Successfully",
            token,
            userRes
        });

    }
    catch (dbError) {

        if (dbError.code === 11000) {
            return res.send({
                _status: false,
                _message: "Email already exists"
            })
        }

        let errors = []

        if (dbError.errors) {
            for (let errorKey in dbError.errors) {
                errors.push({
                    [errorKey]: dbError.errors[errorKey].message
                })
            }
        }
        res.send({
            _status: false,
            _message: "Error Found",
            errors
        })
    }
    console.log("BODY:", req.body);
    console.log("DB:", mongoose.connection.name)
    console.log("EMAIL TRYING:", req.body.email)
    console.log("API HIT")

}

let login = async (req, res) => {
    let { email, password } = req.body

    let checkEmail = await userModal.findOne({ email })
    if (checkEmail) {
        let dbPassword = checkEmail.password
        if (bcrypt.compareSync(password, dbPassword)) {
            //Token create
            let token = jwt.sign({ id: checkEmail._id }, process.env.TOKENKEY)

            res.send({
                _status: true,
                _message: "Login Successfully",
                token
            })
        }
        else {
            res.send({
                _status: false,
                _message: "Invalid Password",
                // errors
            })
        }

    }
    else {
        res.send({
            _status: false,
            _message: "Invalid Email Id",
            // errors
        })
    }
}

let changePassword = async (req, res) => {
    console.log(req.body);

    let { oldPassword, newPassword, confirmPassword, user_id } = req.body

    let checkId = await userModal.findOne({ _id: user_id })
    if (checkId) {
        let dbPassword = checkId.password
        if (bcrypt.compareSync(oldPassword, dbPassword)) {
            if (newPassword == confirmPassword) {
                const hash = bcrypt.hashSync(newPassword, saltRounds)
                let updatedPassword = await userModal.updateOne(
                    {
                        _id: user_id
                    },
                    {
                        $set: {
                            password: hash
                        }
                    }
                )
                res.send({
                    _status: true,
                    _message: "Password Changed Successfully",
                    // errors
                })
            }
            else {
                res.send({
                    _status: false,
                    _message: "New Password and Confirm Password does'nt match",
                    // errors
                })
            }
        }
        else {
            res.send({
                _status: true,
                _message: "Invalid Old Password",
                // errors
            })
        }
    }
    else {
        res.send({
            _status: true,
            _message: "Id not available",
            // errors
        })
    }


}

let forgotPassword = async (req, res) => {
    let { email } = req.body
    let checkEmail = await userModal.findOne({ email })
    if (checkEmail) {
        await transporter.sendMail({
            from: '"Online Furniture Shop" <nehaparmar2378@gmail.com>',
            to: email,
            subject: "Reset Your Password",
            html: `
            <h1>Reset Your Password</h1>
            <p>Click the link given below to reset your password:</p>
            <a href="http://localhost:3000/reset-password/${checkEmail._id}">Reset Password</a>
            `
        })

        await userModal.updateOne(
            {
                _id: checkEmail._id
            },
            {
                $set: {
                    // resetPasswordToken : "",
                    resetPasswordExpires: Date.now() + 600000
                }
            }
        )
        res.send({
            _status: true,
            _message: "Reset Password Link Shared"
        })
    }
    else {
        res.send({
            _status: false,
            _message: "Email Id doesn't exist."
        })
    }
}

let resetPassword = (req, res) => {
    let { id } = req.params
    let { newPassword, confirmPassword } = req.body

    let checkId = userModal.findOne({ _id: id })
    if (checkId) {
        if (newPassword == confirmPassword) {
            const hash = bcrypt.hashSync(newPassword, saltRounds)
            userModal.updateOne(
                {
                    _id: id
                },
                {
                    $set: {
                        password: hash
                    }
                }
            ).then((data) => {
                res.send({
                    _status: true,
                    _message: "Password Changed Successfully",
                    // errors
                })
            }).catch((err) => {
                res.send({
                    _status: false,
                    _message: "Something went wrong",
                    // errors
                })
            })
        }
        else {
            res.send({
                _status: false,
                _message: "New Password and Confirm Password does'nt match",
                // errors
            })
        }
    }
    else {
        res.send({
            _status: false,
            _message: "Invalid Email Id."
        })
    }
}

let viewProfile = async (req, res) => {

    let checkId = await userModal.findById(req.userId)
    if (checkId) {
        // let updatedPassword = await userModal.updateOne(
        //     {
        //         _id: req.body.user_id
        //     },
        //     {
        //         $set: req.body
        //     }
        // )

        // let userProfile = await userModal.findOne({ _id: req.body.user_id })

        res.send({
            _status: true,
            _message: "View Profile",
            _userProfile: checkId
        })
    }
    else {
        res.send({
            _status: false,
            _message: "No User Found"
        })
    }
    console.log("USER ID:", req.userId);

}

let updateProfile = async (req, res) => {
    try {
        let { name, address, mobile_number, gender } = req.body;
        let userId = req.userId;
        let image = ''
        if (req.file) {
            image = req.file.filename
            if (image) {

            }
        }

        let data = await userModal.updateOne(
            { _id: userId },
            {
                $set: { name, address, mobile_number, gender, image }
            }
        );

        res.send({
            _status: true,
            _message: "Profile Updated Successfully",
            data
        });

    } catch (err) {
        res.send({
            _status: false,
            _message: "Some Error Found",
            err
        });
    }
};

const { cartModel } = require("../../model/cartModel");

let addtoCart = async (req, res) => {
    const user_id = req.userId;
    const product_id = req.body.product_id;

    try {

        // check if product already exists in cart
        let existingItem = await cartModel.findOne({
            user_id,
            product_id
        });

        if (existingItem) {
            // increase quantity
            existingItem.quantity += 1;
            await existingItem.save();

            return res.send({
                _status: true,
                _message: "Quantity updated",
                data: existingItem
            });
        }

        // else create new cart item
        let newItem = new cartModel({
            user_id,
            product_id,
            quantity: 1
        });

        await newItem.save();

        res.send({
            _status: true,
            _message: "Product added to cart",
            data: newItem
        });

    } catch (error) {
        res.send({
            _status: false,
            _message: "Error",
            error
        });
    }
};

let getCart = async (req, res) => {
    let userId = req.userId;

    try {
        let cartItems = await cartModel.find({ user_id: userId });

        res.send({
            _status: true,
            data: cartItems
        });

    } catch (error) {
        res.send({
            _status: false,
            _message: "Error",
            error
        });
    }
};

let removeFromCart = async (req, res) => {
    const user_id = req.userId;
    const product_id = req.body.product_id;

    try {
        await cartModel.deleteOne({ user_id, product_id });

        res.send({
            _status: true,
            _message: "Item removed"
        });

    } catch (error) {
        res.send({
            _status: false,
            _message: "Error",
            error
        });
    }
};

let updateCart = async (req, res) => {
    const user_id = req.userId;
    const { product_id, quantity } = req.body;

    try {
        if (!product_id || quantity < 1) {
            return res.send({
                _status: false,
                _message: "Invalid product_id or quantity"
            });
        }

        let updatedItem = await cartModel.findOneAndUpdate(
            { user_id, product_id },
            { $set: { quantity } },
            { new: true }  // returns updated document
        );

        if (!updatedItem) {
            return res.send({
                _status: false,
                _message: "Cart item not found"
            });
        }

        res.send({
            _status: true,
            _message: "Quantity updated successfully",
            data: updatedItem
        });

    } catch (error) {
        res.send({
            _status: false,
            _message: "Error",
            error
        });
    }
};

const { wishlistModel } = require("../../model/wishlistModel");

let addToWishlist = async (req, res) => {
    const user_id = req.userId;
    const { product_id } = req.body;

    try {
        const existing = await wishlistModel.findOne({ user_id, product_id });

        if (existing) {
            await wishlistModel.deleteOne({ user_id, product_id });
            return res.send({ _status: true, _message: "Removed from wishlist" });
        }

        await wishlistModel.create({ user_id, product_id });
        res.send({ _status: true, _message: "Added to wishlist" });

    } catch (error) {
        res.send({ _status: false, _message: "Error", error });
    }
};

let getWishlist = async (req, res) => {
    const user_id = req.userId;

    try {
        const wishlist = await wishlistModel.find({ user_id });
        res.send({ _status: true, data: wishlist });
    } catch (error) {
        res.send({ _status: false, _message: "Error", error });
    }
};



module.exports = { register, login, changePassword, forgotPassword, resetPassword, updateProfile, viewProfile, addtoCart, getCart, removeFromCart, updateCart, addToWishlist, getWishlist }