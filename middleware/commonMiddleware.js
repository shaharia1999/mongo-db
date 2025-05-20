const express = require("express");
const applyCommonMiddleware = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = applyCommonMiddleware;
