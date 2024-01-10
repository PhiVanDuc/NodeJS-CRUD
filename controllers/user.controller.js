const sql = require("../utils/db");
const userModel = require("../models/user.model");
const { string } = require('yup');

module.exports = {
    index: async (req, res, next) => {
        let users;
        const { status, keyword } = req.query;

        try {
            users = await userModel.all(status, keyword);
            return res.render("users/index", {
                users: users,
                success: req.flash("success")[0]
            })
        }
        catch (e) {
            return next(e);
        }
    },

    add: (req, res,) => {
        return res.render("users/add", { req })
    },

    handleAdd: async (req, res, next) => {
        const body = await req.validate(req.body, {
            name: string().required('Tên bắt buộc phải nhập!'),
            email: string().required("Email bắt buộc phải nhập!").email("Email không đúng định dạng!").test("check-dup", "Email đã tồn tại", async (value) => {
                try {
                    const email = await userModel.getEmail(value);
                    return email.length === 0;
                }
                catch(e) {
                    return next(e);
                }
            }),
            status: string().test('check-status', 'Trạng thái không hợp lệ', (value) => {
                return +value === 0 || +value === 1;
            })
        });
        
        if (body) {
            try {
                await userModel.add(body);
            }
            catch(e) {
                return next(e);
            }
            req.flash('success', "success")
            return res.redirect("/users");
        }
        else return res.redirect("/users/add");
    }
}