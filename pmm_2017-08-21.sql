# ************************************************************
# Sequel Pro SQL dump
# Version 4499
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 192.168.0.107 (MySQL 10.1.25-MariaDB)
# Database: pmm
# Generation Time: 2017-08-21 11:20:47 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table banks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `banks`;

CREATE TABLE `banks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `bankname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `banks` WRITE;
/*!40000 ALTER TABLE `banks` DISABLE KEYS */;

INSERT INTO `banks` (`id`, `bankname`)
VALUES
	(2,'Dutch Bangla Bank Ltd.'),
	(3,'Sonali Bank Ltd.'),
	(4,'Mutual Trust Bank Ltd.'),
	(5,'Standard Bank Ltd.'),
	(6,'Prime Bank Ltd.');

/*!40000 ALTER TABLE `banks` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table deposit
# ------------------------------------------------------------

DROP TABLE IF EXISTS `deposit`;

CREATE TABLE `deposit` (
  `uid` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT '0',
  `description` varchar(500) DEFAULT '',
  `dtime` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `deposit` WRITE;
/*!40000 ALTER TABLE `deposit` DISABLE KEYS */;

INSERT INTO `deposit` (`uid`, `bid`, `amount`, `description`, `dtime`)
VALUES
	(2,2,1000,'Initial Check','2017-08-14'),
	(2,3,75000,'Order from XYZ','2017-08-15'),
	(2,2,100,'Check after db change','2017-08-14'),
	(2,2,15000,'House Rent','2017-08-14'),
	(2,2,100000,'For Semester Fee','2017-08-15'),
	(2,2,7000,'from home','2017-08-15'),
	(2,4,10000,'Sample','2017-08-16');

/*!40000 ALTER TABLE `deposit` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mybanks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mybanks`;

CREATE TABLE `mybanks` (
  `uid` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  `currentbalance` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`bid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `mybanks` WRITE;
/*!40000 ALTER TABLE `mybanks` DISABLE KEYS */;

INSERT INTO `mybanks` (`uid`, `bid`, `currentbalance`)
VALUES
	(2,2,10100),
	(2,3,75200),
	(2,4,13000);

/*!40000 ALTER TABLE `mybanks` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `wallet` int(11) unsigned DEFAULT '0',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`uid`, `name`, `email`, `password`, `wallet`)
VALUES
	(2,'Koushik Roy','96koushikroy@gmail.com','$2a$10$x5e0Mr.SznqpIeBZIqoXNOmZdC3D6vQu.4BQqGnEmU3d.snUQzHWy',22500),
	(8,'Nur Islam','nurislam03@gmail.com','$2a$10$HH5ZBdGFIJ72YVSJE3g2GOZajaknnEkNk28nMKFo.5UPUJ9uOAydm',10000);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table wallet_add
# ------------------------------------------------------------

DROP TABLE IF EXISTS `wallet_add`;

CREATE TABLE `wallet_add` (
  `uid` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `dtime` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `wallet_add` WRITE;
/*!40000 ALTER TABLE `wallet_add` DISABLE KEYS */;

INSERT INTO `wallet_add` (`uid`, `amount`, `description`, `dtime`)
VALUES
	(2,1500,'From NSU For Contest','2017-08-16'),
	(2,500,'Test','2017-08-16'),
	(2,1000,'Test 2','2017-08-16'),
	(2,1000,'Test 3','2017-08-16'),
	(2,1000,'Test 4','2017-08-16'),
	(2,2000,'Testing From Another Page','2017-08-16'),
	(8,10000,'From Home For House Rent','2017-08-20'),
	(2,2000,'Checking new bug fix #FromBank','2017-08-03');

/*!40000 ALTER TABLE `wallet_add` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table wallet_spent
# ------------------------------------------------------------

DROP TABLE IF EXISTS `wallet_spent`;

CREATE TABLE `wallet_spent` (
  `uid` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `dtime` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `wallet_spent` WRITE;
/*!40000 ALTER TABLE `wallet_spent` DISABLE KEYS */;

INSERT INTO `wallet_spent` (`uid`, `amount`, `description`, `dtime`)
VALUES
	(2,2000,'Movie with Friends','2017-08-16'),
	(2,30,'Rickshaw','2017-08-15'),
	(2,970,'Checking','2017-08-14'),
	(2,1500,'Checking From Another Page','2017-08-14');

/*!40000 ALTER TABLE `wallet_spent` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table withdraw
# ------------------------------------------------------------

DROP TABLE IF EXISTS `withdraw`;

CREATE TABLE `withdraw` (
  `uid` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `wallet` tinyint(1) DEFAULT NULL,
  `dtime` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `withdraw` WRITE;
/*!40000 ALTER TABLE `withdraw` DISABLE KEYS */;

INSERT INTO `withdraw` (`uid`, `bid`, `amount`, `description`, `wallet`, `dtime`)
VALUES
	(2,3,1000,'Withdraw Check',1,'2017-08-14'),
	(2,2,15000,'House Rent',1,'2017-08-14'),
	(2,2,95000,'NSU Semester Fee',0,'2017-08-14'),
	(2,4,2000,'Party',1,'2017-08-16'),
	(2,2,2000,'Checking new bug fix',1,'2017-08-03');

/*!40000 ALTER TABLE `withdraw` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
