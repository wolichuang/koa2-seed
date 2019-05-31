DROP TABLE IF EXISTS `tab_users`;
CREATE TABLE `tab_users` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8 NOT NULL,
  `password` varchar(50) CHARACTER SET utf8 NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `age` varchar(30) DEFAULT NULL,
  `realname` varchar(50) CHARACTER SET gb2312 NOT NULL,
  `birthday` varchar(20) NOT NULL,
  `address` varchar(120) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
INSERT INTO `tab_users` VALUES ('1', 'obltlmtn', 'icauow', 'y.lafgmsbm@hxvux.mobi', '30', '贺静', '1992-12-27', '浙江省 温州市');
INSERT INTO `tab_users` VALUES ('2', 'jnkht', 'emkeeiv', 'g.gngkfj@nhswewb.ro', '26', '吴伟', '1993-05-18', '河北省 承德市');
INSERT INTO `tab_users` VALUES ('3', 'yyilwbrg', 'angy', 'n.mwtkyh@dtd.th', '44', '江军', '1980-04-22', '甘肃省 张掖市');
INSERT INTO `tab_users` VALUES ('4', 'niqytdy', 'yqfcabfxc', 'f.ytjwixbsb@drhelo.sm', '47', '乔艳', '1992-12-08', '浙江省 绍兴市');
INSERT INTO `tab_users` VALUES ('5', 'kwzgotw', 'yijurn', 'a.plyyvg@uzlpvuae.as', '20', '袁平', '1976-01-26', '云南省 曲靖市');
