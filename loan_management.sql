-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2021 at 07:32 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `loan_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_info`
--

CREATE TABLE `admin_info` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `loan_info`
--

CREATE TABLE `loan_info` (
  `loan_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `loan_type` varchar(30) DEFAULT NULL,
  `total_loan` varchar(30) DEFAULT NULL,
  `paid_loan` varchar(30) DEFAULT '0',
  `loan_tenure` varchar(10) DEFAULT NULL,
  `tenure_completed` varchar(30) DEFAULT '0',
  `tenure_parameter` varchar(20) DEFAULT NULL,
  `interest_rate` varchar(10) DEFAULT NULL,
  `installment_amt` varchar(30) DEFAULT NULL,
  `issue_date` timestamp NULL DEFAULT current_timestamp(),
  `installment_due_date` varchar(50) DEFAULT NULL,
  `loan_status` varchar(10) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transaction_info`
--

CREATE TABLE `transaction_info` (
  `tid` int(11) NOT NULL,
  `loan_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `note` varchar(50) DEFAULT NULL,
  `paid_amount` int(11) DEFAULT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `mobile` varchar(10) DEFAULT NULL,
  `dob` varchar(30) DEFAULT NULL,
  `date_registered` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `address` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_info`
--
ALTER TABLE `admin_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loan_info`
--
ALTER TABLE `loan_info`
  ADD PRIMARY KEY (`loan_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `transaction_info`
--
ALTER TABLE `transaction_info`
  ADD PRIMARY KEY (`tid`),
  ADD KEY `FK_uid` (`user_id`),
  ADD KEY `fk_loan_id` (`loan_id`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_info`
--
ALTER TABLE `admin_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loan_info`
--
ALTER TABLE `loan_info`
  MODIFY `loan_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction_info`
--
ALTER TABLE `transaction_info`
  MODIFY `tid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `loan_info`
--
ALTER TABLE `loan_info`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`);

--
-- Constraints for table `transaction_info`
--
ALTER TABLE `transaction_info`
  ADD CONSTRAINT `FK_uid` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`),
  ADD CONSTRAINT `fk_loan_id` FOREIGN KEY (`loan_id`) REFERENCES `loan_info` (`loan_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
