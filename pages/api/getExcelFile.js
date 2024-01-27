import fetch from 'node-fetch';
import ExcelJS from 'exceljs';

export default async (req, res) => {
  try {
    const { filename } = req.query;
    if (!filename) {
      return res.status(400).json({ message: 'No filename provided.' });
    }

    const cloudinaryUrl = `https://res.cloudinary.com/dpkkaacjk/raw/upload/uploads/${filename}`;

    const response = await fetch(cloudinaryUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fileData = await response.buffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileData);

    const worksheet = workbook.getWorksheet(1);
    const jsonData = [];
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const rowData = {};
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        rowData[`column${colNumber}`] = cell.value;
      });
      jsonData.push(rowData);
    });

    res.status(200).json({ message: 'File retrieved successfully.', data: jsonData });
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the file.' });
  }
};
