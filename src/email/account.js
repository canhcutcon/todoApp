const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
            to: email,
            from: 'utauhosina2001@gmail.com',
            subject: 'Một chiếc mail iu thưng!',
            text: `Đây là mail tự động gửi bằng code, ${name}. Pé Giang iu anh nhìu nhìu:3.`
        }).then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
            to: email,
            from: 'utauhosina2001@gmail.com',
            subject: 'Thanks for all!',
            text: `Hello, ${name}. Let me know why you leave.`
        }).then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        })
}



module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}