# 📦 E-commerce Delivery Prediction using Machine Learning

## 🔍 Project Overview

This project predicts whether an e-commerce shipment will be delivered **on time** using machine learning techniques. The goal is to analyze shipment, product, and customer-related data to identify key patterns affecting delivery performance.

The project was developed as part of the **CSE422: Artificial Intelligence** course and applies both **supervised** and **unsupervised** learning approaches following a complete machine learning workflow.

---

## 🎯 Problem Statement

Timely delivery is a crucial factor in customer satisfaction in the e-commerce industry. Delays can lead to customer dissatisfaction, increased operational costs, and reduced trust.

This project aims to:

* Predict on-time delivery of shipments (binary classification)
* Compare multiple machine learning models
* Analyze model performance using appropriate evaluation metrics
* Explore hidden patterns using unsupervised learning

---

## 📊 Dataset Overview

* **Total Samples:** 10,999
* **Input Features:** 11
* **Target Variable:** `Reached.on.Time_Y.N`

  * `1` → Shipment reached on time
  * `0` → Shipment did not reach on time

### Feature Types

* **Categorical:** Warehouse block, Mode of shipment, Product importance, Gender
* **Numerical:** Cost, Weight, Discount, Customer rating, Prior purchases, etc.

---

## 🧠 Machine Learning Models Used

### Supervised Learning

* Logistic Regression
* K-Nearest Neighbors (KNN)
* Decision Tree
* Neural Network

### Unsupervised Learning

* K-Means Clustering

---

## ⚙️ Methodology

The project follows a standard machine learning pipeline:

1. Exploratory Data Analysis (EDA)
2. Handling categorical features using **One-Hot Encoding**
3. Feature scaling using **StandardScaler**
4. Train–test split (70% training, 30% testing with stratification)
5. Model training and evaluation
6. Model comparison using multiple metrics
7. Unsupervised clustering using K-Means

---

## 📈 Evaluation Metrics

Due to class imbalance, model performance was evaluated using multiple metrics:

* Accuracy
* Precision
* Recall
* F1-score
* ROC–AUC
* Confusion Matrix

---

## 🏆 Key Results

* All supervised models achieved comparable accuracy (~65–68%)
* Accuracy alone was not sufficient due to class imbalance
* **Neural Network** achieved the most balanced performance across:

  * Precision
  * Recall
  * F1-score
  * ROC–AUC
* K-Means clustering provided additional exploratory insights into shipment behavior patterns

---

## 🧩 Project Structure

```
ecommerce-delivery-prediction/
│
├── notebooks/
│   └── ecommerce_delivery_prediction.ipynb
│
├── data/
│   └── dataset.csv
│
├── README.md
```

---

## 🌐 Project Web Page

🔗 **Live Project Page:**
https://ecommerce-delivery-prediction.netlify.app/

---

## 👤 Author

**Abrar Ahsan Purno**
Undergraduate Student
Department of Computer Science and Engineering

🔗 LinkedIn: https://www.linkedin.com/in/abrarahsan007/
🔗 GitHub: https://github.com/pur-no

---

## 📌 Acknowledgements

* Course: **CSE422 – Artificial Intelligence**
* Dataset provided as part of course materials

---

## 📝 License

This project is intended for **academic and learning purposes**.

---
