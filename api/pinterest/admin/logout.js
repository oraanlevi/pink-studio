'use strict';

module.exports = (req, res) => {
  res.setHeader(
    'Set-Cookie',
    'pws_admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
  );
  res.writeHead(302, { Location: '/admin/pinterest/connect/' });
  res.end();
};
