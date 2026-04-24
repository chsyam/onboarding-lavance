-- 1. users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  token VARCHAR(500),
  started_dt DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. employees
CREATE TABLE IF NOT EXISTS  employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  display_name VARCHAR(200),
  email VARCHAR(255),
  phone VARCHAR(20),
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  date_of_birth DATE,
  nationality VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. address
CREATE TABLE IF NOT EXISTS  address (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL UNIQUE,
  residential_address VARCHAR(255),
  residential_city VARCHAR(100),
  residential_state VARCHAR(100),
  residential_zip_code VARCHAR(20),
  residential_country VARCHAR(100) DEFAULT 'US',
  is_address_same BOOLEAN DEFAULT TRUE,
  permenant_address VARCHAR(255),
  permanent_city VARCHAR(100),
  permanent_state VARCHAR(100),
  permanent_zip_code VARCHAR(20),
  permanent_country VARCHAR(100) DEFAULT 'US',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 4. documents
CREATE TABLE IF NOT EXISTS  documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL UNIQUE,
  passport VARCHAR(500),
  ssn VARCHAR(500),
  work_permit VARCHAR(500),
  resume VARCHAR(500),
  latest_degree_certificate VARCHAR(500),
  experience_letter VARCHAR(500),
  previous_payslip_1 VARCHAR(500),
  previous_payslip_2 VARCHAR(500),
  previous_payslip_3 VARCHAR(500),
  offer_acknowledgement VARCHAR(500),
  signed_nda VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 5. work_authorization
CREATE TABLE IF NOT EXISTS  work_authorization (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL UNIQUE,
  ssn VARCHAR(20),
  work_permit_number VARCHAR(100),
  work_authorization_status VARCHAR(50),
  visa_type VARCHAR(50),
  visa_expiry_date DATE,
  passport_number VARCHAR(50),
  country_of_issue VARCHAR(100),
  passport_expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 6. education
CREATE TABLE IF NOT EXISTS  education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  highest_qualification VARCHAR(100),
  degree_name VARCHAR(150),
  specialization VARCHAR(150),
  university VARCHAR(255),
  graduated_year YEAR,
  grade VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 7. payroll_tax_details
CREATE TABLE IF NOT EXISTS  payroll_tax_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL UNIQUE,
  bank_name VARCHAR(200),
  routing_number VARCHAR(20),
  account_number VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);