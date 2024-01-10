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
                success: req.flash("success")[0],
            })
        }
        catch (e) {
            return next(e);
        }
    },

    add: (req, res) => {
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
            req.flash('success', "Thêm thành công!");
            return res.redirect("/users");
        }
        else return res.redirect("/users/add");
    },

    edit: async (req, res, next) => {
        const { id } = req.query;
        if(!req.query.id) return res.redirect('/users');

        try {
            const user = await userModel.getUser(id);
            return res.render('users/edit', { user: user[0], req });
        }
        catch(e) {
            return next(e);
        }
    },

    handleEdit: async (req, res, next) => {
        if (isNaN(+req.query.id)) return res.redirect(`/users`);

        const body = await req.validate(req.body, {
            name: string().required('Tên bắt buộc phải nhập!'),
            email: string().required("Email bắt buộc phải nhập!").email("Email không đúng định dạng!").test("check-dup", "Email đã tồn tại", async (value) => {
                try {
                    const emails = await userModel.getEmailEdit(value, req.query.id);
                    return emails.length === 0;
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
                await userModel.edit(body, +req.query.id);
            }
            catch(e) {
                return next(e);
            }
            req.flash('success', "Sửa thành công!");
            return res.redirect(`/users`);
        }
        else return res.redirect(`/users/edit?id=${req.query.id}`);
    },

    handleDelete: async (req, res, next) => {
        const { id } = req.body;
        
        try {
            await userModel.delete(id);
            req.flash('success', "Xóa thành công!");
            return res.redirect("/users");
        }   
        catch(e) {
            return next(e);
        }
    }
}