CREATE DATABASE IF NOT EXISTS PulsePoint;
USE PulsePoint;

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  ID VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dept VARCHAR(100) NOT NULL,
  conditionstatus VARCHAR(50) NOT NULL
);

-- Doctor Table
CREATE TABLE IF NOT EXISTS doctor (
  ID VARCHAR(20) PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Specialization VARCHAR(100) NOT NULL,
  PhoneNumber VARCHAR(20) NOT NULL
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(20) PRIMARY KEY,
  time VARCHAR(20) NOT NULL,
  doctor VARCHAR(100) NOT NULL,
  patient VARCHAR(100) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending'
);

-- Insert Initial Patients Data
INSERT IGNORE INTO patients (ID, name, dept, conditionstatus) VALUES
('#PX-101', 'Elena Gilbert', 'Cardiology', 'Stable'),
('#PX-102', 'Marcus Vane', 'Neurology', 'Critical');

-- Insert Initial Doctor Data
INSERT IGNORE INTO doctor (ID, Name, Specialization, PhoneNumber) VALUES
('DOC-01', 'Dr. Gregory House', 'Diagnostics', '555-0101'),
('DOC-02', 'Dr. Meredith Grey', 'General Surgery', '555-0102'),
('DOC-03', 'Dr. Shaun Murphy', 'Surgery', '555-0103'),
('DOC-04', 'Dr. Sanjeeva', 'X-Ray specialist', '555-0104'),
('DOC-05', 'Dr. Jeevitha Patel', 'Dermatologist', '555-0105'),
('DOC-06', 'Dr. Gaurav', 'Cardiologist', '555-0106'),
('DOC-07', 'Dr. Chinthan', 'Physician', '555-0107');

-- Insert Initial Appointments Data
INSERT IGNORE INTO appointments (id, time, doctor, patient, reason, status) VALUES
('APT-001', '09:15 AM', 'Dr. Gregory House', 'Alice Brown', 'Cardiac Checkup', 'Pending'),
('APT-002', '10:00 AM', 'Dr. Meredith Grey', 'John Smith', 'Post-Op Followup', 'Pending'),
('APT-003', '10:00 AM', 'Dr. Bhuvana', 'Krithika', 'Throat infection', 'Pending'),
('APT-004', '10:30 AM', 'Dr. Chinthan', 'Preeti', 'Fever', 'Accepted'),
('APT-005', '12:00 PM', 'Dr. Gaurav', 'joseph', 'Cardiologist check', 'Accepted');
