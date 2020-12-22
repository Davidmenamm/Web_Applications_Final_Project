-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Users` (
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Name`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`GlobalChat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`GlobalChat` (
  `idGlobalChat` INT NOT NULL AUTO_INCREMENT,
  `Msg` LONGTEXT NOT NULL,
  `From` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idGlobalChat`),
  INDEX `fk_GlobalChat_Users1_idx` (`From` ASC) VISIBLE,
  CONSTRAINT `fk_GlobalChat_Users1`
    FOREIGN KEY (`From`)
    REFERENCES `mydb`.`Users` (`Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Chat` (
  `idChat` INT NOT NULL AUTO_INCREMENT,
  `Product` VARCHAR(45) NULL,
  PRIMARY KEY (`idChat`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Message` (
  `idMessage` INT NOT NULL AUTO_INCREMENT,
  `Msg` LONGTEXT NULL,
  `msg_datetime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `Chat_idChat` INT NOT NULL,
  `Users_Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idMessage`, `Chat_idChat`),
  INDEX `fk_Message_Chat1_idx` (`Chat_idChat` ASC) VISIBLE,
  INDEX `fk_Message_Users1_idx` (`Users_Name` ASC) VISIBLE,
  CONSTRAINT `fk_Message_Chat1`
    FOREIGN KEY (`Chat_idChat`)
    REFERENCES `mydb`.`Chat` (`idChat`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Message_Users1`
    FOREIGN KEY (`Users_Name`)
    REFERENCES `mydb`.`Users` (`Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`user_chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`user_chat` (
  `Users_Name` VARCHAR(45) NOT NULL,
  `Chat_idChat` INT NOT NULL,
  PRIMARY KEY (`Users_Name`, `Chat_idChat`),
  INDEX `fk_Users_has_Chat_Chat1_idx` (`Chat_idChat` ASC) VISIBLE,
  INDEX `fk_Users_has_Chat_Users1_idx` (`Users_Name` ASC) VISIBLE,
  CONSTRAINT `fk_Users_has_Chat_Users1`
    FOREIGN KEY (`Users_Name`)
    REFERENCES `mydb`.`Users` (`Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Users_has_Chat_Chat1`
    FOREIGN KEY (`Chat_idChat`)
    REFERENCES `mydb`.`Chat` (`idChat`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
