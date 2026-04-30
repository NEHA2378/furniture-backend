const orderModal = require("../../model/orderModel");
const Razorpay = require('razorpay')

var instance = new Razorpay({
    key_id: 'rzp_test_WAft3lA6ly3OBc',
    key_secret: '68E17CNWY8SemCvZ6ylOkuOY'
});

let placeOrder = async (req, res) => {

    const dataSave = req.body;
    dataSave.user_id = req.userId;

    var orderCount = await orderModal.find().countDocuments()
    dataSave.order_number = 'MONSTA_' + (1001 + orderCount)

    orderModal(dataSave).save()
        .then(async (result) => {

            const orderInfo = await instance.orders.create(
                {
                    "amount": result.net_amount * 100,
                    "currency": "INR",
                    "receipt": result._id,
                    "partial_payment": false
                }
            )

            await orderModal.updateOne({
                _id: result._id,
            },
                {
                    $set: {
                        order_id: orderInfo.id
                    }
                }
            )

            var orderData = await orderModal.findOne({ _id: result._id })

            const data = {
                _status: true,
                _message: "Order Placed",
                _data: result,
                _orderInfo: orderInfo,
                _data: orderData
            }

            res.send(data)
        })
        .catch((dbError) => {

            let errors = []
            let obj = {}
            for (let errorKey in dbError.errors) {
                obj[errorKey] = dbError.errors[errorKey].message
                errors.push(obj)
                obj = {}
            }

            const data = {
                _status: false,
                _message: "Something went wrong",
                _error: errors
            }

            res.send(data)
            console.log("DB ERROR:", dbError);
        })

}

let changeOrderStatus = async (req, res) => {
    var paymentInfo = await instance.payments.fetch(req.body.payment_id);

    if (paymentInfo.status == 'failed') {
        var dataSave = {
            payment_status: 3,
            order_status: 7,
            payment_id: req.body.payment_id
        }
    }
    else {
        var dataSave = {
            payment_status: 2,
            order_status: 2,
            payment_id: req.body.payment_id
        }
    }

    await orderModal.updateOne({
        order_id: req.body.order_id
    }, {
        $set: dataSave
    })
        .then(async () => {

            var orderInfo = await orderModal.findOne({ order_id: req.body.order_id })

            const data = {
                _status: true,
                _message: "Order Placed",
                _data: orderInfo
            }
            res.send(data)
        })
        .catch(() => {
            const data = {
                _status: false,
                _message: "Something went wrong",
            }

            res.send(data)
        })
}
let getOrders = async (req, res) => {
    try {
        const orders = await orderModal.find({ user_id: req.userId }).sort({ created_at: -1 });
        res.send({
            _status: true,
            _message: "Orders fetched",
            _data: orders
        });
    } catch (err) {
        res.send({
            _status: false,
            _message: "Something went wrong"
        });
    }
}

// let register = async (req, res) => {

//     let reqobj = { ...req.body }

//     const hash = bcrypt.hashSync(req.body.password, saltRounds)

//     reqobj['password'] = hash

//     try {
//         let user = new userModal(reqobj)

//         let userRes = await user.save();

//         let token = jwt.sign({ id: userRes._id }, process.env.TOKENKEY)

//         res.send({
//             _status: true,
//             _message: "Registerred Successfully",
//             token,
//             userRes
//         });

//     }
//     catch (dbError) {

//         if (dbError.code === 11000) {
//             return res.send({
//                 _status: false,
//                 _message: "Email already exists"
//             })
//         }

//         let errors = []

//         if (dbError.errors) {
//             for (let errorKey in dbError.errors) {
//                 errors.push({
//                     [errorKey]: dbError.errors[errorKey].message
//                 })
//             }
//         }
//         res.send({
//             _status: false,
//             _message: "Error Found",
//             errors
//         })
//     }
//     console.log("BODY:", req.body);
//     console.log("DB:", mongoose.connection.name)
//     console.log("EMAIL TRYING:", req.body.email)
//     console.log("API HIT")

// }

// let login = async (req, res) => {
//     let { email, password } = req.body

//     let checkEmail = await userModal.findOne({ email })
//     if (checkEmail) {
//         let dbPassword = checkEmail.password
//         if (bcrypt.compareSync(password, dbPassword)) {
//             //Token create
//             let token = jwt.sign({ id: checkEmail._id }, process.env.TOKENKEY)

//             res.send({
//                 _status: true,
//                 _message: "Login Successfully",
//                 token
//             })
//         }
//         else {
//             res.send({
//                 _status: false,
//                 _message: "Invalid Password",
//                 // errors
//             })
//         }

//     }
//     else {
//         res.send({
//             _status: false,
//             _message: "Invalid Email Id",
//             // errors
//         })
//     }
// }

// let changePassword = async (req, res) => {
//     console.log(req.body);

//     let { oldPassword, newPassword, confirmPassword, user_id } = req.body

//     let checkId = await userModal.findOne({ _id: user_id })
//     if (checkId) {
//         let dbPassword = checkId.password
//         if (bcrypt.compareSync(oldPassword, dbPassword)) {
//             if (newPassword == confirmPassword) {
//                 const hash = bcrypt.hashSync(newPassword, saltRounds)
//                 let updatedPassword = await userModal.updateOne(
//                     {
//                         _id: user_id
//                     },
//                     {
//                         $set: {
//                             password: hash
//                         }
//                     }
//                 )
//                 res.send({
//                     _status: true,
//                     _message: "Password Changed Successfully",
//                     // errors
//                 })
//             }
//             else {
//                 res.send({
//                     _status: false,
//                     _message: "New Password and Confirm Password does'nt match",
//                     // errors
//                 })
//             }
//         }
//         else {
//             res.send({
//                 _status: true,
//                 _message: "Invalid Old Password",
//                 // errors
//             })
//         }
//     }
//     else {
//         res.send({
//             _status: true,
//             _message: "Id not available",
//             // errors
//         })
//     }


// }

// let forgotPassword = async (req, res) => {
//     let { email } = req.body
//     let checkEmail = await userModal.findOne({ email })
//     if (checkEmail) {
//         await transporter.sendMail({
//             from: '"Online Furniture Shop" <nehaparmar2378@gmail.com>',
//             to: email,
//             subject: "Reset Your Password",
//             html: `
//             <h1>Reset Your Password</h1>
//             <p>Click the link given below to reset your password:</p>
//             <a href="http://localhost:3000/reset-password/${checkEmail._id}">Reset Password</a>
//             `
//         })

//         await userModal.updateOne(
//             {
//                 _id: checkEmail._id
//             },
//             {
//                 $set: {
//                     // resetPasswordToken : "",
//                     resetPasswordExpires: Date.now() + 600000
//                 }
//             }
//         )
//         res.send({
//             _status: true,
//             _message: "Reset Password Link Shared"
//         })
//     }
//     else {
//         res.send({
//             _status: false,
//             _message: "Email Id doesn't exist."
//         })
//     }
// }

// let resetPassword = (req, res) => {
//     let { id } = req.params
//     let { newPassword, confirmPassword } = req.body

//     let checkId = userModal.findOne({ _id: id })
//     if (checkId) {
//         if (newPassword == confirmPassword) {
//             const hash = bcrypt.hashSync(newPassword, saltRounds)
//             userModal.updateOne(
//                 {
//                     _id: id
//                 },
//                 {
//                     $set: {
//                         password: hash
//                     }
//                 }
//             ).then((data) => {
//                 res.send({
//                     _status: true,
//                     _message: "Password Changed Successfully",
//                     // errors
//                 })
//             }).catch((err) => {
//                 res.send({
//                     _status: false,
//                     _message: "Something went wrong",
//                     // errors
//                 })
//             })
//         }
//         else {
//             res.send({
//                 _status: false,
//                 _message: "New Password and Confirm Password does'nt match",
//                 // errors
//             })
//         }
//     }
//     else {
//         res.send({
//             _status: false,
//             _message: "Invalid Email Id."
//         })
//     }
// }

// let viewProfile = async (req, res) => {

//     let checkId = await userModal.findById(req.userId)
//     if (checkId) {
//         // let updatedPassword = await userModal.updateOne(
//         //     {
//         //         _id: req.body.user_id
//         //     },
//         //     {
//         //         $set: req.body
//         //     }
//         // )

//         // let userProfile = await userModal.findOne({ _id: req.body.user_id })

//         res.send({
//             _status: true,
//             _message: "View Profile",
//             _userProfile: checkId
//         })
//     }
//     else {
//         res.send({
//             _status: false,
//             _message: "No User Found"
//         })
//     }
// console.log("USER ID:", req.userId);

// }

// let updateProfile = async (req, res) => {
//     try {
//         let { name, address, mobile_number, gender } = req.body;
//         let userId = req.userId;
//         let image = ''
//         if (req.file) {
//             image = req.file.filename
//             if (image) {

//             }
//         }

//         let data = await userModal.updateOne(
//             { _id: userId },
//             {
//                 $set: { name, address, mobile_number, gender, image }
//             }
//         );

//         res.send({
//             _status: true,
//             _message: "Profile Updated Successfully",
//             data
//         });

//     } catch (err) {
//         res.send({
//             _status: false,
//             _message: "Some Error Found",
//             err
//         });
//     }
// };


module.exports = { placeOrder, changeOrderStatus, getOrders }