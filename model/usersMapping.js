const usersMapping = {
    queryAll: 'select * from tab_users',
    insertUser:'INSERT INTO tab_users(id, username, password,realname) VALUES(0,?,?,?)',
    updateUser:'update tab_users set username=?, password=?, realname=? where id=?',
    deleteById: 'delete from tab_users where id=?',
    queryById: 'select * from tab_users where id=?'
};

module.exports = usersMapping;